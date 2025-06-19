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
exports.SongController = void 0;
const songService_1 = require("../services/songService");
const http_status_codes_1 = require("http-status-codes");
const getSongs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const response = yield songService_1.SongService.getSongService(songid, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const getAllSongs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const response = yield songService_1.SongService.getAllSongsService(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const getSongsByArtist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artist_id } = req.params;
        const response = yield songService_1.SongService.getSongsByArtistService(artist_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const searchSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.query;
        const result = yield songService_1.SongService.searchSongService(keyword);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const toggleFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield songService_1.SongService.toggleFavoriteService(songid, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const addSongIntoPlayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const playListId = req.body.playListId;
        const result = yield songService_1.SongService.addSongIntoPlayListService(songid, userId, playListId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const createPlayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const name = req.body.name;
        const result = yield songService_1.SongService.createPlayListService(songid, userId, name);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const addHistorySong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield songService_1.SongService.addHistoryService(songid, userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const addNewSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = req.jwtDecoded;
        const userId = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { title, artist: rawArtist, genre, description, lyrics } = req.body;
        const songsArray = Array.isArray(rawArtist)
            ? rawArtist
            : rawArtist
                ? [rawArtist]
                : [];
        const files = req.files;
        const songRequest = {
            title,
            artist: songsArray,
            genre,
            fileavatar: files.fileavatar[0].buffer,
            description,
            lyrics,
            fileaudio: files.fileaudio[0].buffer,
        };
        const result = yield songService_1.SongService.addNewSong(userId, songRequest);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const updateSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const userData = req.jwtDecoded;
        const userId = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { title, artist, genre, description, lyrics } = req.body;
        const { song_id } = req.params;
        const files = req.files;
        const songRequest = {
            title,
            artist,
            genre,
            fileavatar: (_d = (_c = (_b = files === null || files === void 0 ? void 0 : files.fileavatar) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.buffer) !== null && _d !== void 0 ? _d : null,
            description,
            lyrics,
            fileaudio: (_g = (_f = (_e = files === null || files === void 0 ? void 0 : files.fileaudio) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.buffer) !== null && _g !== void 0 ? _g : null,
        };
        const result = yield songService_1.SongService.updateSong(userId, songRequest, song_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const deletedSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = req.jwtDecoded;
        const userId = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { song_id } = req.params;
        const result = yield songService_1.SongService.deletedsong(userId, song_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const restoreSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { song_id } = req.params;
        const result = yield songService_1.SongService.restoresong(song_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAllSongAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield songService_1.SongService.getAllSongAdmin();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
exports.SongController = {
    getSongs,
    getAllSongs,
    getSongsByArtist,
    toggleFavorite,
    addSongIntoPlayList,
    createPlayList,
    addHistorySong,
    addNewSong,
    updateSong,
    deletedSong,
    restoreSong,
    searchSong,
    getAllSongAdmin
};
