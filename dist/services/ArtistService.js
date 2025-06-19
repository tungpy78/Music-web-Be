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
exports.ArtistService = void 0;
const Album_model_1 = __importDefault(require("../models/Album.model"));
const Artist_model_1 = __importDefault(require("../models/Artist.model"));
const Song_model_1 = __importDefault(require("../models/Song.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const Cloudinary_1 = __importDefault(require("../Utils/Cloudinary"));
const HistoryActionService_1 = require("./HistoryActionService");
const http_status_codes_1 = require("http-status-codes");
const create = (userId, aritistRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(aritistRequest.fileAvata, {
            resource_type: 'image',
            folder: 'songs/avatar',
        });
        const artist = new Artist_model_1.default();
        Object.assign(artist, Object.assign(Object.assign({}, aritistRequest), { imageUrl: avatarUrl }));
        yield artist.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Thêm Aritist mới: " + artist.id);
        return "Thêm tác gia thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thêm tác giả: " + e);
    }
});
const getAllArtist = () => __awaiter(void 0, void 0, void 0, function* () {
    const artist = yield Artist_model_1.default.find();
    if (!artist || artist.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy nghệ sĩ nào");
    }
    return artist;
});
const updateArtist = (userId, aritistRequest, aritist_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artist = yield Artist_model_1.default.findById(aritist_id);
        if (!artist) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy tác giả yêu cầu");
        }
        let content = `Đã thay đổi các thuộc tính của Aritist ${aritist_id}:\n`;
        let hasChanges = false;
        if (aritistRequest.fileAvata) {
            const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(aritistRequest.fileAvata, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            artist.imageUrl = avatarUrl;
            content += `- Ảnh đại diện: ${artist.imageUrl} -> ${avatarUrl}\n`;
            hasChanges = true;
        }
        if (artist.name != aritistRequest.name) {
            content += `- Tên : ${artist.name} -> ${aritistRequest.name}\n`;
            artist.name = aritistRequest.name;
            hasChanges = true;
        }
        if (artist.bio != aritistRequest.bio) {
            content += `- Bio : ${artist.bio} -> ${aritistRequest.bio}\n`;
            artist.bio = aritistRequest.bio;
            hasChanges = true;
        }
        if (hasChanges) {
            yield artist.save();
            yield HistoryActionService_1.HistoryActionService.create(userId, content);
        }
        return " Cập nhập thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi update Artist: " + e);
    }
});
const getArtistByIdService = (artistId) => __awaiter(void 0, void 0, void 0, function* () {
    const artist = yield Artist_model_1.default.findById(artistId);
    if (!artist) {
        throw new AppError_1.default(404, "Không tìm thấy tác giả yêu cầu");
    }
    const songs = yield Song_model_1.default.find({ artist: artistId, deleted: false }).select('title avatar').populate('artist', 'name');
    const albums = yield Album_model_1.default.find({ artist: artistId });
    return Object.assign(Object.assign({}, artist.toObject()), { songs,
        albums });
});
exports.ArtistService = {
    create,
    getAllArtist,
    updateArtist,
    getArtistByIdService
};
