import Song from '../models/Song.model';
import History from '../models/History.model';
import mongoose from 'mongoose';

/**
 * Hàm tiện ích để xáo trộn một mảng.
 */
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Gợi ý các bài hát dựa trên phiên nghe nhạc, đã được tinh chỉnh với các thông số thực tế:
 * - Trọng số theo hàm mũ để phản ứng nhanh với sự thay đổi tâm trạng.
 * - Tỷ lệ 70/30 giữa "Khai thác" (cùng nghệ sĩ) và "Khám phá" (cùng thể loại).
 */
export const getSessionBasedRecommendations = async (
    userId: string, 
    historyLimit: number = 5, 
    recommendationLimit: number = 10,
    excludeIds: string[] = []
): Promise<any[]> => {
    try {
        console.log("Thử gợi ý dựa trên phiên (đã tinh chỉnh)...");
        
        const recentHistory = await History.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ listenedAt: -1 })
            .limit(historyLimit)
            .populate({
                path: 'songId', model: 'Song',
                populate: [{ path: 'artist', model: 'Artist' }, { path: 'genre', model: 'Topic' }]
            });

        if (recentHistory.length < 2) return [];

        const recentSongs = recentHistory.map(h => h.songId as any).filter(s => s);
        if (recentSongs.length === 0) return [];
        const recentSongIds = recentSongs.map(s => s._id);

        // --- NÂNG CẤP: Sử dụng Trọng số theo hàm mũ ---
        const genreWeights: { [key: string]: number } = {};
        const artistWeights: { [key: string]: number } = {};
        
        recentSongs.forEach((song, index) => {
            // Điểm số: 16, 8, 4, 2, 1
            const weight = Math.pow(2, historyLimit - 1 - index); 

            if (song.genre) {
                const genreId = song.genre._id.toString();
                genreWeights[genreId] = (genreWeights[genreId] || 0) + weight;
            }
            if (song.artist) {
                song.artist.forEach((artist: any) => {
                    const artistId = artist._id.toString();
                    artistWeights[artistId] = (artistWeights[artistId] || 0) + weight;
                });
            }
        });
        
        const topGenre = Object.keys(genreWeights).sort((a, b) => genreWeights[b] - genreWeights[a])[0];
        const topArtistId = Object.keys(artistWeights).sort((a, b) => artistWeights[b] - artistWeights[a])[0];
        // ----------------------------------------------------

        if (!topGenre && !topArtistId) return [];
        
        const allExcludeIds = [...recentSongIds, ...excludeIds.map(id => new mongoose.Types.ObjectId(id))];
        
        let exploitationResults: any[] = [];
        let explorationResults: any[] = [];
        
        // --- TINH CHỈNH: Tỷ lệ 70/30 ---
        const exploitationLimit = 7;
        if (topArtistId) {
            exploitationResults = await Song.find({
                _id: { $nin: allExcludeIds },
                artist: new mongoose.Types.ObjectId(topArtistId)
            })
            .sort({ like: -1 })
            .limit(exploitationLimit)
            .populate('artist').populate('genre');
        }

        const idsForExplorationExclude = [...allExcludeIds, ...exploitationResults.map(s => s._id)];
        
        const explorationLimit = recommendationLimit - exploitationResults.length;
        if (topGenre && explorationLimit > 0) {
            const explorationQuery: any = {
                _id: { $nin: idsForExplorationExclude },
                genre: new mongoose.Types.ObjectId(topGenre),
            };
            if (topArtistId) {
                explorationQuery.artist = { $ne: new mongoose.Types.ObjectId(topArtistId) };
            }

            explorationResults = await Song.find(explorationQuery)
            .sort({ like: -1 })
            .limit(explorationLimit)
            .populate('artist').populate('genre');
        }

        let finalRecommendations = [...exploitationResults, ...explorationResults];
        finalRecommendations = shuffleArray(finalRecommendations);

        console.log(`Đã tìm thấy ${finalRecommendations.length} gợi ý (Khai thác: ${exploitationResults.length}, Khám phá: ${explorationResults.length}).`);
        return finalRecommendations;

    } catch (error) {
        console.error("Lỗi trong getSessionBasedRecommendations (phiên bản nâng cao):", error);
        return [];
    }
};

