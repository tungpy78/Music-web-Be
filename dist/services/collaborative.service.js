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
exports.getCollaborativeRecommendations = void 0;
const axios_1 = __importDefault(require("axios"));
const Song_model_1 = __importDefault(require("../models/Song.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RECOMMENDATION_API_URL = process.env.RECOMMENDATION_API_URL || 'http://localhost:5001';
const getCollaborativeRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${RECOMMENDATION_API_URL}/${userId}?limit=20`);
        const recommendedSongIds = response.data.recommendations;
        if (recommendedSongIds && recommendedSongIds.length > 0) {
            console.log(`Đã tìm thấy ${recommendedSongIds.length} gợi ý từ Lọc cộng tác.`);
            const recommendedSongs = yield Song_model_1.default.find({ _id: { $in: recommendedSongIds } }).populate('artist').populate('genre');
            const orderedSongs = recommendedSongIds.map(id => recommendedSongs.find(song => song._id.toString() === id)).filter(song => song !== undefined);
            return orderedSongs;
        }
        return [];
    }
    catch (error) {
        console.error(`Lỗi khi gọi API Python: ${error}.`);
        return [];
    }
});
exports.getCollaborativeRecommendations = getCollaborativeRecommendations;
