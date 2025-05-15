import { StatusCodes } from "http-status-codes"
import Song from "../models/song.model"
import ApiError from "../Utils/AppError"
import mongoose from "mongoose"
import Favorite from "../models/favorite.model"
import { JwtProvider } from "../providers/JwtProvider"
import Playlist from "../models/Playlist.model"
import History from "../models/History.model"
import { SongRequest } from "../Request/SongRequest"
import { toSlug } from "../Utils/ToSlug"

const getSongService = async (songId: string, userId: string) => {
    console.log("userId",userId)
    console.log("songId",songId)
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

const addNewSong = async(songRequest: SongRequest)=>{
    try{
        const song = new Song();
        Object.assign(song, {
            ...songRequest,
            artist: new mongoose.Types.ObjectId(songRequest.artist),
            genre: new mongoose.Types.ObjectId(songRequest.genre),
        });
        song.slug = toSlug(songRequest.title)
        const saveSong = await song.save();
        return saveSong;
    }catch(e){
      throw new Error("Lỗi: "+ e);
    }

}



export const SongService = {
    getSongService,
    toggleFavoriteService,
    addSongIntoPlayListService,
    createPlayListService,
    addHistoryService,
    addNewSong
}