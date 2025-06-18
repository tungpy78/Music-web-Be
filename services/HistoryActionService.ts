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
      .sort({ listenedAt: -1 }) // 🔥 Sắp xếp theo thời gian mới nhất
      .populate({
        path: "userId",
        select: "fullname account_id",
        populate: {
          path: "account_id",
          select: "phone"
        }
      })
      .select("content userId listenedAt")
      .lean();

    return history.map(item => ({
      _id: item._id,
      content: item.content,
      user: (item.userId as any)?.fullname || "Người dùng không xác định",
      phone: (item.userId as any)?.account_id?.phone || "Không có số điện thoại",
      listenedAt: item.listenedAt
    }));

  } catch (e) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi lấy lịch sử: " + e);
  }
};
export const HistoryActionService = {
    create,
    getHistoryAction
}