import mongoose from "mongoose";
import Favorite from "../models/Favorite.model"

const getFavoriteService = async (userId:string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Đếm tổng số bài hát yêu thích
    const totalItems = await Favorite.countDocuments({ userId: userObjectId });

    // Sử dụng Aggregation Pipeline để lấy và populate thông tin bài hát hiệu quả
    const favorites = await Favorite.aggregate([
        // 1. Tìm các mục yêu thích của người dùng
        { $match: { userId: userObjectId } },
        // 2. Sắp xếp theo ngày thêm mới nhất
        { $sort: { addedAt: -1 } },
        // 3. Áp dụng phân trang
        { $skip: skip },
        { $limit: limit },
        // 4. Join với collection 'Songs' để lấy thông tin chi tiết bài hát
        {
            $lookup: {
                from: 'Songs',
                localField: 'songId',
                foreignField: '_id',
                as: 'songDetails'
            }
        },
        // 5. "Mở" mảng songDetails (vì mỗi favorite chỉ có 1 song)
        { $unwind: '$songDetails' },
        // 6. Join tiếp với 'Artist' từ songDetails
        {
            $lookup: {
                from: 'Artist',
                localField: 'songDetails.artist',
                foreignField: '_id',
                as: 'songDetails.artist'
            }
        },
        // 7. Định dạng lại output cuối cùng
        { $replaceRoot: { newRoot: '$songDetails' } }
    ]);
    
    return {
        message: 'Lấy danh sách yêu thích thành công.',
        data: favorites,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems: totalItems
        }
    };
}
export const favoriteService = {
    getFavoriteService
}