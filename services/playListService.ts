import { StatusCodes } from "http-status-codes";
import Playlist from "../models/Playlist.model"
import ApiError from "../Utils/AppError";
import { Types } from "mongoose";
import User from "../models/User.model";

const getPlayListService = async (userId: string) => {
    const playlist = await Playlist.find({
        userId: userId
    }).populate('userId', 'fullname').populate('songs.songId','avatar'); 

    return playlist
}
const getPlayListByIdService = async (playlistId: String) => {
    const playlistdetail = await Playlist.findById(playlistId)
        .populate({
            path: 'songs.songId',
            populate: {
                path: 'artist',
                model: 'Artist', // Đảm bảo bạn dùng đúng tên model
            }
        })
        if (!playlistdetail) return null;

        const user = await User.findOne({ account_id: playlistdetail.userId }).select('fullname');

        return {
            ...playlistdetail.toObject(),
            userFullname: user?.fullname || 'Không rõ',
        };

}
const removeSongPlayListService = async(songId:string, playlistId: string, userId:string) => {
    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(StatusCodes.NOT_FOUND, "Playlist không tồn tại")
    }

     // Kiểm tra quyền: user chỉ được xóa bài trong playlist của mình
     if (playlist.userId.toString() !== userId) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Bạn không có quyền xóa bài hát khỏi playlist này");
    }

    playlist.songs.pull({
        songId: new Types.ObjectId(songId)  
    });

    await playlist.save();
    await playlist.populate('songs.songId');

    return playlist
}
const deletePlayListService = async (playlistId:string, userId: string) => {
    const isdelete = await Playlist.deleteOne({_id: playlistId, userId: userId})
    return {
        message:"Xóa thành công"
    }
}

export const PlayListService = {
    getPlayListService,
    getPlayListByIdService,
    removeSongPlayListService,
    deletePlayListService
}