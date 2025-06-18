import { StatusCodes } from "http-status-codes"
import History from "../models/History.model"
import ApiError from "../Utils/AppError"

const getHistoryService = async (userId: string) => {
    const history = History.find({userId:userId})
    .limit(6)
    .sort({ listenedAt: -1 })
    .populate({
        path: 'songId',
        populate: {
            path: 'artist', // <-- Lấy thêm artist trong song   
        }
    });
    if(!history){
        throw new ApiError(StatusCodes.NOT_FOUND, "Danh sách trống")
    }
    return history
}
export const HistoryService = {
    getHistoryService
}