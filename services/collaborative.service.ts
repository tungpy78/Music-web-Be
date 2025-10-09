import axios from 'axios';
import Song from '../models/Song.model';
import dotenv from 'dotenv';
dotenv.config();


const RECOMMENDATION_API_URL = process.env.RECOMMENDATION_API_URL || 'http://localhost:5001';

export const getCollaborativeRecommendations = async (userId: string): Promise<any[]> => {
    try {
        const response = await axios.get(`${RECOMMENDATION_API_URL}/recommendations/${userId}?limit=20`);
        const recommendedSongIds: string[] = response.data.recommendations;

        if (recommendedSongIds && recommendedSongIds.length > 0) {
            console.log(`Đã tìm thấy ${recommendedSongIds.length} gợi ý từ Lọc cộng tác.`);
            const recommendedSongs = await Song.find({ _id: { $in: recommendedSongIds } }).populate('artist').populate('genre');
            
            // Sắp xếp lại cho đúng thứ tự
            const orderedSongs = recommendedSongIds.map(id =>
                recommendedSongs.find(song => song._id.toString() === id)
            ).filter(song => song !== undefined);
            return orderedSongs;
        }
        return [];
    } catch (error) {
        console.error(`Lỗi khi gọi API Python: ${error}.`);
        return [];
    }
};
