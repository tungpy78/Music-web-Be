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
exports.PlayListService = void 0;
const http_status_codes_1 = require("http-status-codes");
const Playlist_model_1 = __importDefault(require("../models/Playlist.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const mongoose_1 = require("mongoose");
const User_model_1 = __importDefault(require("../models/User.model"));
const getPlayListService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const playlist = yield Playlist_model_1.default.find({
        userId: userId
    }).populate('userId', 'fullname').populate('songs.songId', 'avatar');
    return playlist;
});
const getPlayListByIdService = (playlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const playlistdetail = yield Playlist_model_1.default.findById(playlistId, { userId: userId })
        .populate({
        path: 'songs.songId',
        populate: {
            path: 'artist',
            model: 'Artist',
        }
    });
    if (!playlistdetail)
        return null;
    const user = yield User_model_1.default.findOne({ _id: userId }).select('fullname');
    return Object.assign(Object.assign({}, playlistdetail.toObject()), { userFullname: (user === null || user === void 0 ? void 0 : user.fullname) || 'Không rõ' });
});
const removeSongPlayListService = (songId, playlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const playlist = yield Playlist_model_1.default.findById(playlistId);
    if (!playlist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Playlist không tồn tại");
    }
    if (playlist.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Bạn không có quyền xóa bài hát khỏi playlist này");
    }
    playlist.songs.pull({
        songId: new mongoose_1.Types.ObjectId(songId)
    });
    yield playlist.save();
    yield playlist.populate('songs.songId');
    return playlist;
});
const deletePlayListService = (playlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isdelete = yield Playlist_model_1.default.deleteOne({ _id: playlistId, userId: userId });
    return {
        message: "Xóa thành công"
    };
});
exports.PlayListService = {
    getPlayListService,
    getPlayListByIdService,
    removeSongPlayListService,
    deletePlayListService
};
