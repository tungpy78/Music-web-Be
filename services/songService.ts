import { StatusCodes } from "http-status-codes"
import Song from "../models/Song.model"
import ApiError from "../Utils/AppError"
import mongoose from "mongoose"
import Favorite from "../models/Favorite.model"
import { JwtProvider } from "../providers/JwtProvider"
import Playlist from "../models/Playlist.model"
import History from "../models/History.model"
import { SongRequest } from "../Request/SongRequest"
import { toSlug } from "../Utils/ToSlug"
import { removeVietnameseTones } from "../Utils/removeVietnameseTones"
import Cloudinary from "../Utils/Cloudinary"
import Artist from "../models/Artist.model"
import Topic from "../models/Topic.model"
import { HistoryActionService } from "./HistoryActionService"

const getSongService = async (songId: string, userId: string) => {
    const song = await Song.findById(songId)
    .populate("artist")
    .populate("genre")

    const favorite = await Favorite.find(
        {
            songId:songId,
            userId: userId
        }
    )
 
    const playList = await Playlist.find(
        {
            userId:userId,
            "songs.songId":songId
        }
    )
    const allPlayList = await Playlist.find({userId})


    
    if (!song ) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }
    return {
        song,
        favorite,
        playList,
        allPlayList
    }
}

const getPaginatedSongsService = async (page: number, limit: number) => {
    // Tính toán số lượng bản ghi cần bỏ qua
    const skip = (page - 1) * limit;

    // Lấy tổng số bài hát để tính toán tổng số trang cho frontend
    const totalSongs = await Song.countDocuments({ deleted: false });

    // Truy vấn dữ liệu với .skip() và .limit()
    const songs = await Song.find({ deleted: false })
        .sort({ like: -1 }) // Sắp xếp theo lượt thích cho BXH
        .skip(skip)         // Bỏ qua các bài hát của các trang trước
        .limit(limit)       // Giới hạn số lượng bài hát cho trang hiện tại
        .populate("artist")
        .populate("genre");

    return {
        message: 'Lấy danh sách bài hát phân trang thành công',
        data: songs,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalSongs / limit),
            totalItems: totalSongs
        }
    };
};

const getSongsByArtistService = async (artist_id: string) => {
    const artist = await Artist.findById(artist_id);
    if (!artist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
    }
    // Lấy tất cả bài hát của nghệ sĩ đó, không bao gồm những bài đã xóa
    // và sắp xếp theo số lượt thích giảm dần
    // Sử dụng populate để lấy thông tin nghệ sĩ và thể loại
    const songs = await Song.find({ artist: artist_id, deleted: false })
      .populate("artist")

    return songs;
}

const searchSongService = async (keyword: string) => {
  if (!keyword || typeof keyword !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Keyword is required and must be a string");
  }

  // 1. Tạo một Regular Expression từ keyword để tìm kiếm không phân biệt hoa/thường
    const keywordNoTone = removeVietnameseTones(keyword).toLowerCase();
    const keywordRegex = new RegExp(keywordNoTone, 'i');

  // 2. Sử dụng Aggregation Pipeline để tìm kiếm hiệu quả
  const songs = await Song.aggregate([
    // Giai đoạn 1: Kết nối (JOIN) với bảng Artist
    {
      $lookup: {
        from: 'Artist', // Tên collection của Artist
        localField: 'artist',
        foreignField: '_id',
        as: 'artistDetails'
      }
    },
    // Giai đoạn 2: Lọc kết quả dựa trên title của bài hát HOẶC name của nghệ sĩ
    {
      $match: {
        $or: [
            { search_title: keywordRegex },
            { 'artistDetails.search_name': keywordRegex }
        ]
      }
    },
    // Giai đoạn 3 (Tùy chọn): Populate thông tin genre
    {
        $lookup: {
            from: "Topics", // Tên collection của Topic/Genre
            localField: "genre",
            foreignField: "_id",
            as: "genreDetails"
        }
    },
    // Giai đoạn 4 (Tùy chọn): Định dạng lại output cho đẹp
    {
        $project: {
            title: 1,
            like: 1,
            avatar: 1,
            audio: 1,
            slug: 1,
            artist: "$artistDetails", // Thay thế mảng artist cũ bằng artistDetails
            genre: { $arrayElemAt: ["$genreDetails", 0] } // Lấy phần tử đầu tiên của genreDetails
        }
    },
     // THÊM GIAI ĐOẠN NÀY VÀO
    // Giai đoạn 5: Sắp xếp kết quả, ưu tiên bài nhiều like hơn
    {
        $sort: { like: -1 } // -1 để sắp xếp từ cao đến thấp
    },

    // (Tùy chọn) Giai đoạn 6: Giới hạn số lượng kết quả trả về
    {
        $limit: 20 // Ví dụ: chỉ lấy 20 kết quả hàng đầu
    }

  ]);

  return songs;
    };

const toggleFavoriteService = async (songId: string, userId: string) => {
    const existing = await Favorite.findOne({ songId, userId });

    if (existing) {
        // Đã yêu thích => gỡ yêu thích
        await Favorite.deleteOne({ songId, userId });
        await Song.updateOne(  { _id: songId, like: { $gt: 0 } }, { $inc: { like: -1 } });
        return { status: false }; // false = không còn yêu thích
    } else {
        // Chưa yêu thích => thêm yêu thích
        await Favorite.create({ songId, userId });
        await Song.updateOne({ _id: songId }, { $inc: { like: 1 } });
        return { status: true }; // true = đã yêu thích
    }
}
const addSongIntoPlayListService = async (songId: string, userId: string, playListId: string) => {
    if (!playListId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Phải chọn PlayList");
    }

    // Tìm playlist của user
    const playlist = await Playlist.findOne({
        _id: new mongoose.Types.ObjectId(playListId),
        userId: new mongoose.Types.ObjectId(userId),
    });

    if (!playlist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Playlist không tồn tại.");
    }

    // Kiểm tra quá 20 bài
    if (playlist.songs.length >= 20) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Playlist đã đạt tối đa 20 bài hát.");
    }

    // Kiểm tra bài hát đã tồn tại chưa
    const isExisted = playlist.songs.some(song => song.songId?.toString() === songId);
    if (isExisted) {
        return {
            message: "Bài hát đã tồn tại trong PlayList."
        };
    }

    // Thêm bài
    playlist.songs.push({ songId: new mongoose.Types.ObjectId(songId) });
    await playlist.save();

    return {
        message: "Thêm vào PlayList thành công."
    };
};

const createPlayListService = async (songId: string, userId: string, name: string) => {
    const existingPlaylist = await Playlist.findOne({ name, userId });

    if (existingPlaylist) {
        throw new ApiError(StatusCodes.BAD_GATEWAY,'Playlist với tên này đã tồn tại!');
    }
    const createPlayList = await Playlist.create(
        {
            name,
            userId,
            songs: [{ songId }]
        }
    )
    
    return createPlayList;
}
const addHistoryService = async(songId:string, userId:string)=> {
    const existing = await History.findOne({songId:songId, userId: userId})

    if (existing) {
        // Nếu đã có, cập nhật thời gian nghe
        await History.updateOne(
          { _id: existing._id },
          { $set: { listenedAt: new Date() } }
        );
      } else {
        // Nếu chưa có, tạo mới lịch sử nghe
        await History.create({ songId, userId });
      }
    return{
        message:"Thêm vào History thành công"
    }
}

const addNewSong = async(userId: string, songRequest: SongRequest)=>{
    try{
       const audioUrl = await Cloudinary.uploadToCloudinary(songRequest.fileaudio, {
        resource_type: 'video',
        folder: 'songs/audio',
        });

        const avatarUrl = await Cloudinary.uploadToCloudinary(songRequest.fileavatar, {
        resource_type: 'image',
        folder: 'songs/avatar',
        });

        const artistIds: mongoose.Types.ObjectId[] = [];
        for (const artistId of songRequest.artist) {
            const artist = await Artist.findById(artistId);
            if (!artist) {
                throw new ApiError(StatusCodes.FORBIDDEN, `Tác giả không tồn tại: ${artistId}`);
            }
        artistIds.push(new mongoose.Types.ObjectId(artistId));
        }
        const genre = await Topic.findById(songRequest.genre);
        if(!genre){
            throw new ApiError(StatusCodes.FORBIDDEN,"Không có thể loại tương ứng")
        }
        const song = new Song();
        Object.assign(song, {
            ...songRequest,
            artist: artistIds,
            genre: new mongoose.Types.ObjectId(songRequest.genre),
            audio: audioUrl,
            avatar: avatarUrl
        });
        song.slug = toSlug(songRequest.title)
        await song.save();
        await HistoryActionService.create(userId,"Thêm bài hát mới: "+song.id);
        return "Thêm thành công ";
    }catch(e){
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Lỗi khi thêm nhạc: "+ e);
    }

}

const updateSong = async (userId: string, songRequest: SongRequest,song_id: string) => {
    try{
        const song = await Song.findById(song_id)
        if(!song){
            throw new ApiError(StatusCodes.FORBIDDEN,"Không tìm thấy bài hát tương ứng: ");
        }

        const artist = await Artist.findById(songRequest.artist);
        if(!artist){
            throw new ApiError(StatusCodes.FORBIDDEN,"Tác giả không tồn tại")
        }


        const genre = await Topic.findById(songRequest.genre);
        if(!genre){
            throw new ApiError(StatusCodes.FORBIDDEN,"Không có thể loại tương ứng")
        }

        let content =`Đã thay đổi các thuộc tính của song ${song_id}:\n`;
        let hasChanges = false;
        if (songRequest.fileavatar) {
            const avatarUrl = await Cloudinary.uploadToCloudinary(songRequest.fileavatar, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            content += `- Ảnh đại diện: ${song.avatar} -> ${avatarUrl}\n`;
            song.avatar = avatarUrl;
            hasChanges = true;
        }

        if (songRequest.fileaudio) {
            const audioUrl = await Cloudinary.uploadToCloudinary(songRequest.fileaudio, {
                resource_type: 'video',
                folder: 'songs/audio',
            });
            content += `- Audio: ${song.audio} -> ${audioUrl}\n`;
            song.audio = audioUrl;
            hasChanges = true;
        }

        if (songRequest.title !== song.title) {
            content += `- Tiêu đề: ${song.title} -> ${songRequest.title}\n`;
            song.title = songRequest.title;
            song.slug = toSlug(songRequest.title);
            hasChanges = true;
        }

        if (songRequest.description !== song.description) {
            content += `- Mô tả: ${song.description} -> ${songRequest.description}\n`;
            song.description = songRequest.description;
            hasChanges = true;
        }

        if (songRequest.lyrics !== song.lyrics) {
            content += `- Lời bài hát: ${song.lyrics} -> ${songRequest.lyrics}\n`;
            song.lyrics = songRequest.lyrics;
            hasChanges = true;
        }

        const newArtistIds: mongoose.Types.ObjectId[] = [];
        for (const artistId of songRequest.artist) {
            const artist = await Artist.findById(artistId);
            if (!artist) {
                throw new ApiError(StatusCodes.FORBIDDEN, `Tác giả không tồn tại: ${artistId}`);
            }
            newArtistIds.push(new mongoose.Types.ObjectId(artistId));
        }
        const oldArtistIds = song.artist.map((id: mongoose.Types.ObjectId) => id.toString());
        const newArtistIdsStr = newArtistIds.map(id => id.toString());

        const isDifferent =
            oldArtistIds.length !== newArtistIdsStr.length ||
            !oldArtistIds.every(id => newArtistIdsStr.includes(id));

        if (isDifferent) {
            content += `- Tác giả: [${oldArtistIds.join(', ')}] -> [${newArtistIdsStr.join(', ')}]\n`;
            song.artist = newArtistIds;
            hasChanges = true;
        }

        const newGenreId = new mongoose.Types.ObjectId(songRequest.genre);
        if (song.genre.toString() !== newGenreId.toString()) {
            content += `- Thể loại: ${song.genre} -> ${newGenreId}\n`;
            song.genre = newGenreId;
            hasChanges = true;
        }

        if (hasChanges) {
            await song.save();
            await HistoryActionService.create(userId, content);
        }

        return "update thành công"
    }catch(e){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Lỗi khi thay đổi thông tin: "+e);
    }
}

const deletedsong = async(userId: string, song_id: string) => {
    try{
        const song = await Song.findById(song_id);
        if(!song){
            throw new ApiError(StatusCodes.FORBIDDEN,"Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = true;
        await song.save();
        await HistoryActionService.create(userId,"Đã xóa bài hát: "+song_id);
        return "Xóa thành công"
    }catch(e){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Lỗi khi xóa bài nhạc: "+e);
    }
}

const restoresong = async(song_id: string) => {
    try{
        const song = await Song.findById(song_id);
        if(!song){
            throw new ApiError(StatusCodes.FORBIDDEN,"Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = false;
        await song.save();
        return "Khôi phục thành công"
    }catch(e){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Lỗi khi xóa bài nhạc: "+e);
    }
}

const getAllSongAdmin = async () => {
  const songs = await Song.find()
    .populate("artist")
    .populate("genre");
  return songs;
}

export const SongService = {
    getSongService,
    getPaginatedSongsService,
    getSongsByArtistService,
    toggleFavoriteService,
    addSongIntoPlayListService,
    createPlayListService,
    addHistoryService,
    addNewSong,
    searchSongService,
    updateSong,
    deletedsong,
    restoresong,
    getAllSongAdmin

}