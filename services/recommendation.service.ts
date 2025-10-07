import Song from '../models/Song.model';
import { getCollaborativeRecommendations } from './collaborative.service';
import { getSessionBasedRecommendations } from './sessionBased.service';
import { getContentBasedRecommendations } from './contentBased.service';
import mongoose from 'mongoose';

/**
 * Lấy danh sách gợi ý cho trang chủ.
 * Logic: Collaborative Filtering -> fallback Top Trending.
 */
export const getHomepageRecommendations = async (userId: string) => {
    // 1. Cố gắng lấy gợi ý cá nhân hóa từ Lọc cộng tác
    const collaborativeSongs = await getCollaborativeRecommendations(userId);
    if (collaborativeSongs.length > 0) {
        return collaborativeSongs;
    }

    // 2. Fallback: Nếu không có, trả về top bài hát thịnh hành
    console.log("Fallback: Gợi ý top bài hát thịnh hành cho trang chủ.");
    const topSongs = await Song.find({})
                               .sort({ like: -1 })
                               .limit(20)
                               .populate('artist').populate('genre');
    return topSongs;
};

/**
 * Lấy danh sách các bài hát liên quan để phát tiếp theo.
 * Logic: Session-Based -> Content-Based -> Top Trending.
 */
export const getRelatedSongs = async (currentSongId: string, userId: string, excludeIds: string[]) => {
    // 1. Cố gắng lấy gợi ý dựa trên "gu" nghe gần đây (Session-Based)
    const sessionSongs = await getSessionBasedRecommendations(userId, 5, 10, excludeIds);
    if (sessionSongs.length > 0) {
        return sessionSongs;
    }

    // 2. Fallback 1: Gợi ý dựa trên bài hát hiện tại (Content-Based)
    const contentSongs = await getContentBasedRecommendations(currentSongId, 10, excludeIds);
    if (contentSongs.length > 0) {
        return contentSongs;
    }

    // 3. Fallback cuối cùng: Top thịnh hành (chống lặp)
    console.log("Fallback: Gợi ý top thịnh hành (chống lặp).");
    const allExcludeIds = [...excludeIds, currentSongId].map(id => new mongoose.Types.ObjectId(id));
    return await Song.find({ _id: { $nin: allExcludeIds } })
        .sort({ like: -1 })
        .limit(10)
        .populate('artist').populate('genre');
};

