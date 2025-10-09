"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionBasedRecommendations = void 0;
const Song_model_1 = __importDefault(require("../models/Song.model"));
const History_model_1 = __importDefault(require("../models/History.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
const getSessionBasedRecommendations = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, historyLimit = 5, recommendationLimit = 10, excludeIds = []) {
    try {
        console.log("Thử gợi ý dựa trên phiên (đã tinh chỉnh)...");
        const recentHistory = yield History_model_1.default.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ listenedAt: -1 })
            .limit(historyLimit)
            .populate({
            path: 'songId', model: 'Song',
            populate: [{ path: 'artist', model: 'Artist' }, { path: 'genre', model: 'Topic' }]
        });
        if (recentHistory.length < 2)
            return [];
        const recentSongs = recentHistory.map(h => h.songId).filter(s => s);
        if (recentSongs.length === 0)
            return [];
        const recentSongIds = recentSongs.map(s => s._id);
        const genreWeights = {};
        const artistWeights = {};
        recentSongs.forEach((song, index) => {
            const weight = Math.pow(2, historyLimit - 1 - index);
            if (song.genre) {
                const genreId = song.genre._id.toString();
                genreWeights[genreId] = (genreWeights[genreId] || 0) + weight;
            }
            if (song.artist) {
                song.artist.forEach((artist) => {
                    const artistId = artist._id.toString();
                    artistWeights[artistId] = (artistWeights[artistId] || 0) + weight;
                });
            }
        });
        const topGenre = Object.keys(genreWeights).sort((a, b) => genreWeights[b] - genreWeights[a])[0];
        const topArtistId = Object.keys(artistWeights).sort((a, b) => artistWeights[b] - artistWeights[a])[0];
        if (!topGenre && !topArtistId)
            return [];
        const allExcludeIds = [...recentSongIds, ...excludeIds.map(id => new mongoose_1.default.Types.ObjectId(id))];
        let exploitationResults = [];
        let explorationResults = [];
        const exploitationLimit = 7;
        if (topArtistId) {
            exploitationResults = yield Song_model_1.default.find({
                _id: { $nin: allExcludeIds },
                artist: new mongoose_1.default.Types.ObjectId(topArtistId)
            })
                .sort({ like: -1 })
                .limit(exploitationLimit)
                .populate('artist').populate('genre');
        }
        const idsForExplorationExclude = [...allExcludeIds, ...exploitationResults.map(s => s._id)];
        const explorationLimit = recommendationLimit - exploitationResults.length;
        if (topGenre && explorationLimit > 0) {
            const explorationQuery = {
                _id: { $nin: idsForExplorationExclude },
                genre: new mongoose_1.default.Types.ObjectId(topGenre),
            };
            if (topArtistId) {
                explorationQuery.artist = { $ne: new mongoose_1.default.Types.ObjectId(topArtistId) };
            }
            explorationResults = yield Song_model_1.default.find(explorationQuery)
                .sort({ like: -1 })
                .limit(explorationLimit)
                .populate('artist').populate('genre');
        }
        let finalRecommendations = [...exploitationResults, ...explorationResults];
        finalRecommendations = shuffleArray(finalRecommendations);
        console.log(`Đã tìm thấy ${finalRecommendations.length} gợi ý (Khai thác: ${exploitationResults.length}, Khám phá: ${explorationResults.length}).`);
        return finalRecommendations;
    }
    catch (error) {
        console.error("Lỗi trong getSessionBasedRecommendations (phiên bản nâng cao):", error);
        return [];
    }
});
exports.getSessionBasedRecommendations = getSessionBasedRecommendations;
