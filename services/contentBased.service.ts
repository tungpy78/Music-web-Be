import Song from '../models/Song.model';
import mongoose from 'mongoose';

/**
 * Gợi ý các bài hát dựa trên nội dung với logic ưu tiên và chống lặp.
 * @param currentSongId ID của bài hát đang phát
 * @param limit Số lượng bài hát gợi ý mong muốn
 * @param excludeIds Danh sách các ID bài hát cần loại trừ khỏi kết quả
 */
export const getContentBasedRecommendations = async (
    currentSongId: string, 
    limit: number = 10,
    excludeIds: string[] = [] // Tham số mới để chống lặp
): Promise<any[]> => {
    console.log("Fallback: Gợi ý dựa trên nội dung (ưu tiên cùng nghệ sĩ, chống lặp).");
    
    const currentSong = await Song.findById(currentSongId);
    if (!currentSong) {
        console.log("Không tìm thấy bài hát hiện tại.");
        return [];
    }

    // Danh sách các ID cần loại trừ (bài hiện tại + các bài đã nghe trong phiên)
    const initialExcludeIds = [...excludeIds, currentSongId].map(id => new mongoose.Types.ObjectId(id));

    // BƯỚC 1: Ưu tiên tìm các bài hát có CÙNG NGHỆ SĨ
    const artistRecommendations = await Song.find({
        _id: { $nin: initialExcludeIds }, 
        artist: { $in: currentSong.artist }
    })
    .sort({ like: -1 })
    .limit(limit)
    .populate('artist')
    .populate('genre');

    let finalRecommendations = artistRecommendations;
    
    // BƯỚC 2: Nếu chưa đủ, tìm thêm các bài hát CÙNG THỂ LOẠI
    if (finalRecommendations.length < limit) {
        const remainingLimit = limit - finalRecommendations.length;
        
        // Cập nhật danh sách loại trừ, thêm cả những bài đã tìm thấy ở bước 1
        const allExcludeIds = [
            ...initialExcludeIds, 
            ...finalRecommendations.map(song => song._id)
        ];

        const genreRecommendations = await Song.find({
            _id: { $nin: allExcludeIds },
            genre: currentSong.genre
        })
        .sort({ like: -1 })
        .limit(remainingLimit)
        .populate('artist')
        .populate('genre');

        finalRecommendations = [...finalRecommendations, ...genreRecommendations];
    }

    console.log(`Đã tìm thấy ${finalRecommendations.length} bài hát gợi ý dựa trên nội dung.`);
    return finalRecommendations;
};

