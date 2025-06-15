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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayListController = void 0;
const http_status_codes_1 = require("http-status-codes");
const playListService_1 = require("../services/playListService");
const getPlayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield playListService_1.PlayListService.getPlayListService(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getPlayListById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playlistId } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield playListService_1.PlayListService.getPlayListByIdService(playlistId, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const removeSongPlayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songId, playlistId } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield playListService_1.PlayListService.removeSongPlayListService(songId, playlistId, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const deletePlayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playlistId } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const response = yield playListService_1.PlayListService.deletePlayListService(playlistId, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.PlayListController = {
    getPlayList,
    getPlayListById,
    removeSongPlayList,
    deletePlayList
};
