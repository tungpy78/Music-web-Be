import mongoose from "mongoose";
import HistoryAction from "../models/HistoryAction.model";
import ApiError from "../Utils/AppError"
import { StatusCodes } from "http-status-codes"

const create = async (userId: string, content: string) =>{
    try{
        const historyAction = new HistoryAction();
        historyAction.userId = new mongoose.Types.ObjectId(userId);
        historyAction.content = content;
        await historyAction.save();
        return "Thành công"
    }catch(e){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Lỗi khi thêm thay đổi: "+ e);
    }
}
const getHistoryAction = async () => {
  try {
    const history = await HistoryAction.find()
      .populate({
        path: "userId",
        select: "fullname"
      })
      .select("content userId")
      .lean();

    return history.map(item => ({
      _id: item._id,
      content: item.content,
      user: (item.userId as any)?.fullname || "Người dùng không xác định",
    }));

  } catch (e) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thêm thay đổi: " + e);
  }
};
export const HistoryActionService = {
    create,
    getHistoryAction
}