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
exports.getRelatedSongs = exports.getHomepageRecommendations = void 0;
const Song_model_1 = __importDefault(require("../models/Song.model"));
const collaborative_service_1 = require("./collaborative.service");
const sessionBased_service_1 = require("./sessionBased.service");
const contentBased_service_1 = require("./contentBased.service");
const mongoose_1 = __importDefault(require("mongoose"));
const getHomepageRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const collaborativeSongs = yield (0, collaborative_service_1.getCollaborativeRecommendations)(userId);
    if (collaborativeSongs.length > 0) {
        return collaborativeSongs;
    }
    console.log("Fallback: Gợi ý top bài hát thịnh hành cho trang chủ.");
    const topSongs = yield Song_model_1.default.find({})
        .sort({ like: -1 })
        .limit(20)
        .populate('artist').populate('genre');
    return topSongs;
});
exports.getHomepageRecommendations = getHomepageRecommendations;
const getRelatedSongs = (currentSongId, userId, excludeIds) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionSongs = yield (0, sessionBased_service_1.getSessionBasedRecommendations)(userId, 5, 10, excludeIds);
    if (sessionSongs.length > 0) {
        return sessionSongs;
    }
    const contentSongs = yield (0, contentBased_service_1.getContentBasedRecommendations)(currentSongId, 10, excludeIds);
    if (contentSongs.length > 0) {
        return contentSongs;
    }
    console.log("Fallback: Gợi ý top thịnh hành (chống lặp).");
    const allExcludeIds = [...excludeIds, currentSongId].map(id => new mongoose_1.default.Types.ObjectId(id));
    return yield Song_model_1.default.find({ _id: { $nin: allExcludeIds } })
        .sort({ like: -1 })
        .limit(10)
        .populate('artist').populate('genre');
});
exports.getRelatedSongs = getRelatedSongs;
