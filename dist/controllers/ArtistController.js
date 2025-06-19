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
exports.ArtistController = void 0;
const ArtistService_1 = require("../services/ArtistService");
const http_status_codes_1 = require("http-status-codes");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, bio } = req.body;
        const userId = req.jwtDecoded.userInfo.userId;
        const files = req.files;
        if (!name || !files) {
            res.status(400).json({ message: 'Thiếu trường bắt buộc: name, avatar', });
            return;
        }
        const artistRequest = {
            name: name,
            bio: bio,
            fileAvata: files.fileAvata[0].buffer
        };
        const result = yield ArtistService_1.ArtistService.create(userId, artistRequest);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAllArtist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ArtistService_1.ArtistService.getAllArtist();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const updateArtist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { name, bio } = req.body;
        const { artist_id } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const files = req.files;
        if (!name) {
            res.status(400).json({ message: 'Thiếu trường bắt buộc: name', });
            return;
        }
        const artistRequest = {
            name: name,
            bio: bio,
            fileAvata: (_c = (_b = (_a = files === null || files === void 0 ? void 0 : files.fileAvata) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.buffer) !== null && _c !== void 0 ? _c : null
        };
        const result = yield ArtistService_1.ArtistService.updateArtist(userId, artistRequest, artist_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getArtistById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artistId } = req.params;
        const result = yield ArtistService_1.ArtistService.getArtistByIdService(artistId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
exports.ArtistController = {
    create,
    getAllArtist,
    updateArtist,
    getArtistById
};
