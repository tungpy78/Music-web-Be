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
exports.favoriteService = void 0;
const Favorite_model_1 = __importDefault(require("../models/Favorite.model"));
const getFavoriteService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favorite = yield Favorite_model_1.default.find({
        userId
    }).populate('songId');
    const songs = favorite.map(item => item.songId);
    return songs;
});
exports.favoriteService = {
    getFavoriteService
};
