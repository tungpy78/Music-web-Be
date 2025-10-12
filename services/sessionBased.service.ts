import Song from '../models/Song.model';
import History from '../models/History.model';
import mongoose from 'mongoose';

// Hàm tiện ích để xáo trộn một mảng
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Gợi ý các bài hát dựa trên phiên nghe nhạc, với logic "Khám phá" được cải tiến
 * để lấy ngẫu nhiên các bài hát, tăng tính bất ngờ.
 */
export const getSessionBasedRecommendations = async (
    userId: string, 
    historyLimit: number = 5, 
    recommendationLimit: number = 10,
    excludeIds: string[] = []
): Promise<any[]> => {
    try {
        console.log("Thử gợi ý dựa trên phiên (tăng tính ngẫu nhiên)...");
        
        // 1. Phân tích lịch sử nghe với trọng số (như cũ)
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
        
        const artistWeights: { [key: string]: number } = {};
        const genreWeights: { [key: string]: number } = {};
        
        recentSongs.forEach((song, index) => {
            const weight = Math.pow(2, historyLimit - 1 - index);
            if (song.artist) song.artist.forEach((artist: any) => {
                artistWeights[artist._id.toString()] = (artistWeights[artist._id.toString()] || 0) + weight;
            });
            if (song.genre) {
                genreWeights[song.genre._id.toString()] = (genreWeights[song.genre._id.toString()] || 0) + weight;
            }
        });
        
        const sortedGenres = Object.keys(genreWeights).sort((a, b) => genreWeights[b] - genreWeights[a]);
        const topArtistId = Object.keys(artistWeights).sort((a, b) => artistWeights[b] - artistWeights[a])[0];
        const topGenreId = sortedGenres[0];
        let secondTopGenreId = sortedGenres[1];

        if (!topGenreId && !topArtistId) return [];
        
        let finalRecommendations: any[] = [];
        const allExcludeIds = [...recentSongs.map(s => s._id), ...excludeIds.map(id => new mongoose.Types.ObjectId(id))];
        
        // 2. Bước A (Khai thác): Lấy TỐI ĐA 5 bài của nghệ sĩ nổi bật (vẫn sắp xếp theo lượt thích để đảm bảo chất lượng)
        const exploitationLimit = 5;
        if (topArtistId) {
            const artistSongs = await Song.find({
                _id: { $nin: allExcludeIds },
                artist: new mongoose.Types.ObjectId(topArtistId)
            }).sort({ like: -1 }).limit(exploitationLimit).populate('artist').populate('genre');
            finalRecommendations.push(...artistSongs);
        }

        let currentExcludeIds = [...allExcludeIds, ...finalRecommendations.map(s => s._id)];

        // 3. Bước C (Khám phá mạnh): Cố gắng lấy 2 BÀI NGẪU NHIÊN khác thể loại
        const diverseLimit = 2;
        let diverseSongs: any[] = [];
        if (!secondTopGenreId) { // Tìm thể loại ngẫu nhiên nếu cần
            const popularGenres = await Song.aggregate([
                { $match: { genre: { $nin: [new mongoose.Types.ObjectId(topGenreId)] } } },
                { $group: { _id: '$genre', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);
            if (popularGenres.length > 0) {
                secondTopGenreId = popularGenres[Math.floor(Math.random() * popularGenres.length)]._id.toString();
            }
        }

        if (secondTopGenreId) {
            diverseSongs = await Song.aggregate([
                { $match: { 
                    _id: { $nin: currentExcludeIds },
                    genre: new mongoose.Types.ObjectId(secondTopGenreId)
                }},
                { $sample: { size: diverseLimit } }
            ]);
            await Song.populate(diverseSongs, [{ path: 'artist' }, { path: 'genre' }]);
        }
        
        currentExcludeIds.push(...diverseSongs.map(s => s._id));
        
        // 4. Bước B (Khám phá mềm): Lấy các bài còn lại từ thể loại chính, cũng LẤY NGẪU NHIÊN
        const remainingLimit = recommendationLimit - finalRecommendations.length - diverseSongs.length;
        if (topGenreId && remainingLimit > 0) {
            const genreSongs = await Song.aggregate([
                 { $match: { 
                    _id: { $nin: currentExcludeIds },
                    genre: new mongoose.Types.ObjectId(topGenreId),
                    artist: { $ne: topArtistId ? new mongoose.Types.ObjectId(topArtistId) : null }
                }},
                { $sample: { size: remainingLimit } }
            ]);
            await Song.populate(genreSongs, [{ path: 'artist' }, { path: 'genre' }]);
            finalRecommendations.push(...genreSongs);
        }

        // 5. Kết hợp và xáo trộn
        finalRecommendations.push(...diverseSongs);
        finalRecommendations = shuffleArray(finalRecommendations);

        console.log(`Đã tìm thấy ${finalRecommendations.length} gợi ý (Khai thác: ${exploitationLimit}, Khám phá: ${diverseSongs.length + (finalRecommendations.length - exploitationLimit - diverseSongs.length)}).`);
        return finalRecommendations;

    } catch (error) {
        console.error("Lỗi trong getSessionBasedRecommendations (phiên bản cuối cùng):", error);
        return [];
    }
};

