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
exports.getContentBasedRecommendations = void 0;
const Song_model_1 = __importDefault(require("../models/Song.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getContentBasedRecommendations = (currentSongId_1, ...args_1) => __awaiter(void 0, [currentSongId_1, ...args_1], void 0, function* (currentSongId, limit = 10, excludeIds = []) {
    console.log("Fallback: Gợi ý dựa trên nội dung (ưu tiên cùng nghệ sĩ, chống lặp).");
    const currentSong = yield Song_model_1.default.findById(currentSongId);
    if (!currentSong) {
        console.log("Không tìm thấy bài hát hiện tại.");
        return [];
    }
    const initialExcludeIds = [...excludeIds, currentSongId].map(id => new mongoose_1.default.Types.ObjectId(id));
    const artistRecommendations = yield Song_model_1.default.find({
        _id: { $nin: initialExcludeIds },
        artist: { $in: currentSong.artist }
    })
        .sort({ like: -1 })
        .limit(limit)
        .populate('artist')
        .populate('genre');
    let finalRecommendations = artistRecommendations;
    if (finalRecommendations.length < limit) {
        const remainingLimit = limit - finalRecommendations.length;
        const allExcludeIds = [
            ...initialExcludeIds,
            ...finalRecommendations.map(song => song._id)
        ];
        const genreRecommendations = yield Song_model_1.default.find({
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
});
exports.getContentBasedRecommendations = getContentBasedRecommendations;
