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
exports.AlbumController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AlbumService_1 = require("../services/AlbumService");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const { album_name, decription, release_day, artist, songs: rawSongs } = req.body;
        const songsArray = Array.isArray(rawSongs)
            ? rawSongs
            : rawSongs
                ? [rawSongs]
                : [];
        const files = req.files;
        const albumRequest = {
            album_name: album_name,
            decription: decription,
            release_day: release_day,
            artist: artist,
            songs: songsArray,
            avatar: files.avatar[0].buffer
        };
        const result = yield AlbumService_1.AlbumService.create(userId, albumRequest);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AlbumService_1.AlbumService.getAlbum();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAlbumForAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AlbumService_1.AlbumService.getAlbumForAdmin();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const updateAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const { album_id } = req.params;
        const { album_name, decription, release_day, artist } = req.body;
        const files = req.files;
        const albumUpdateRequest = {
            album_name: album_name,
            decription: decription,
            release_day: release_day,
            artist: artist,
            avatar: (_b = (_a = files === null || files === void 0 ? void 0 : files.avatar) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.buffer
        };
        const result = yield AlbumService_1.AlbumService.updateAlbum(albumUpdateRequest, album_id, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const deletedAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const { album_id } = req.params;
        const result = yield AlbumService_1.AlbumService.deletedAlbum(album_id, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const addSongToAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const { song_id, album_id } = req.body;
        const result = yield AlbumService_1.AlbumService.addSongToAlbum(song_id, album_id, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAllAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AlbumService_1.AlbumService.getAllAlbumservice();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAlbumById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { albumId } = req.params;
        console.log(albumId);
        const result = yield AlbumService_1.AlbumService.getAlbumByIdService(albumId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
exports.AlbumController = {
    create,
    getAlbum,
    updateAlbum,
    deletedAlbum,
    addSongToAlbum,
    getAlbumById,
    getAllAlbum,
    getAlbumForAdmin
};
