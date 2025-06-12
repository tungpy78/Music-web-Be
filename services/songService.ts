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

const searchSongService = async (keyword: string) => {
  if (!keyword || typeof keyword !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Keyword is required and must be a string");
  }

  const keywordNoTone = removeVietnameseTones(keyword).toLowerCase();

  // Lấy tất cả bài hát
  const allSongs = await Song.find()
    .populate("artist")
    .populate("genre");

  // Lọc theo title hoặc artist.name không dấu
  const filteredSongs = allSongs.filter(song => {
    const titleNoTone = removeVietnameseTones(song.title).toLowerCase();
    const artistNameNoTone = song.artist && 'name' in song.artist
      ? removeVietnameseTones((song.artist as any).name).toLowerCase()
      : '';

    return titleNoTone.includes(keywordNoTone) || artistNameNoTone.includes(keywordNoTone);
  });


  return filteredSongs;
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
    const addSongPlayList = await Playlist.updateOne(
        {
            _id: new mongoose.Types.ObjectId(playListId),
            userId: new mongoose.Types.ObjectId(userId),
            'songs.songId': { $ne: new mongoose.Types.ObjectId(songId) }
          },
          {
            $push: {
              songs: { songId: new mongoose.Types.ObjectId(songId) }
            }
          }
    )
    if (addSongPlayList.modifiedCount > 0) {
        return {
          message: "Thêm vào PlayList thành công."
        };
      } else {
        return {
          message: "Bài hát đã tồn tại hoặc playlist không tồn tại."
        };
      }
}
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
    
    return createPlayList
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
        const artist = await Artist.findById(songRequest.artist);
        if(!artist){
            throw new Error("Tác giả không tồn tại")
        }
        const genre = await Topic.findById(songRequest.genre);
        if(!genre){
            throw new Error("Không có thể loại tương ứng")
        }
        const song = new Song();
        Object.assign(song, {
            ...songRequest,
            artist: new mongoose.Types.ObjectId(songRequest.artist),
            genre: new mongoose.Types.ObjectId(songRequest.genre),
            audio: audioUrl,
            avatar: avatarUrl
        });
        song.slug = toSlug(songRequest.title)
        await song.save();
        await HistoryActionService.create(userId,"Thêm bài hát mới: "+song.id);
        return "Thêm thành công ";
    }catch(e){
      throw new Error("Lỗi khi thêm nhạc: "+ e);
    }

}

const updateSong = async (userId: string, songRequest: SongRequest,song_id: string) => {
    try{
        const song = await Song.findById(song_id)
        if(!song){
            throw new Error("Không tìm thấy bài hát tương ứng: ");
        }

        const artist = await Artist.findById(songRequest.artist);
        if(!artist){
            throw new Error("Tác giả không tồn tại")
        }


        const genre = await Topic.findById(songRequest.genre);
        if(!genre){
            throw new Error("Không có thể loại tương ứng")
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

        const newArtistId = new mongoose.Types.ObjectId(songRequest.artist);
        if (song.artist.toString() !== newArtistId.toString()) {
            content += `- Tác giả: ${song.artist} -> ${newArtistId}\n`;
            song.artist = newArtistId;
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
        throw new Error("Lỗi khi thay đổi thông tin: "+e);
    }
}

const deletedsong = async(userId: string, song_id: string) => {
    try{
        const song = await Song.findById(song_id);
        if(!song){
            throw new Error("Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = true;
        await song.save();
        await HistoryActionService.create(userId,"Đã xóa bài hát: "+song_id);
        return "Xóa thành công"
    }catch(e){
        throw new Error("Lỗi khi xóa bài nhạc: "+e);
    }
}

const restoresong = async(song_id: string) => {
    try{
        const song = await Song.findById(song_id);
        if(!song){
            throw new Error("Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = false;
        await song.save();
        return "Khôi phục thành công"
    }catch(e){
        throw new Error("Lỗi khi xóa bài nhạc: "+e);
    }
}

export const SongService = {
    getSongService,
    toggleFavoriteService,
    addSongIntoPlayListService,
    createPlayListService,
    addHistoryService,
    addNewSong,
    searchSongService,
    updateSong,
    deletedsong,
    restoresong
}