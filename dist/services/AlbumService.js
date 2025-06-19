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
exports.AlbumService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Album_model_1 = __importDefault(require("../models/Album.model"));
const HistoryActionService_1 = require("./HistoryActionService");
const Cloudinary_1 = __importDefault(require("../Utils/Cloudinary"));
const Artist_model_1 = __importDefault(require("../models/Artist.model"));
const Song_model_1 = __importDefault(require("../models/Song.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const http_status_codes_1 = require("http-status-codes");
const create = (userId, albumRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const album = new Album_model_1.default();
        const artist = yield Artist_model_1.default.findById(albumRequest.artist);
        if (!artist) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy nghệ sĩ");
        }
        const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(albumRequest.avatar, {
            resource_type: 'image',
            folder: 'songs/avatar',
        });
        album.avatar = avatarUrl;
        album.artist = new mongoose_1.default.Types.ObjectId(albumRequest.artist);
        if (Array.isArray(albumRequest.songs)) {
            for (let i = 0; i < albumRequest.songs.length; i++) {
                const song = yield Song_model_1.default.findById(albumRequest.songs[i]);
                if (!song) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy bài hát" + albumRequest.songs[i]);
                }
                album.songs.push(song._id);
            }
        }
        album.album_name = albumRequest.album_name;
        album.decription = albumRequest.decription;
        album.release_day = albumRequest.release_day;
        yield album.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Đã thêm Album mới: " + album.id);
        return "Thêm thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thêm Album: " + e);
    }
});
const getAlbum = () => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield Album_model_1.default.find();
    if (!album || album.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy album nào");
    }
    return album;
});
const updateAlbum = (albumUpdateRequest, album_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const album = yield Album_model_1.default.findById(album_id);
        if (!album) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy Album tương ứng: " + album_id);
        }
        let content = `Đã thay đổi các thuộc tính của Album ${album_id}:\n`;
        let hasChanges = false;
        if (albumUpdateRequest.avatar) {
            const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(albumUpdateRequest.avatar, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            content += `- Ảnh đại diện: ${album.avatar} -> ${avatarUrl}\n`;
            album.avatar = avatarUrl;
            hasChanges = true;
        }
        const artist = yield Artist_model_1.default.findById(albumUpdateRequest.artist);
        if (!artist) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Tác giả không tồn tại");
        }
        const newArtistId = new mongoose_1.default.Types.ObjectId(albumUpdateRequest.artist);
        if (album.artist.toString() !== newArtistId.toString()) {
            content += `- Tác giả: ${album.artist} -> ${newArtistId}\n`;
            album.artist = newArtistId;
            hasChanges = true;
        }
        if (album.album_name != albumUpdateRequest.album_name) {
            album.album_name = albumUpdateRequest.album_name;
            content += `- Tên album: ${album.album_name} -> ${albumUpdateRequest.album_name}\n`;
            hasChanges = true;
        }
        if (album.decription != albumUpdateRequest.decription) {
            album.decription = albumUpdateRequest.decription;
            content += `- Mô tả: ${album.decription} -> ${albumUpdateRequest.decription}\n`;
            hasChanges = true;
        }
        if (album.release_day != albumUpdateRequest.release_day) {
            album.release_day = albumUpdateRequest.release_day;
            content += `- Ngày phát hành : ${album.release_day} -> ${albumUpdateRequest.release_day}\n`;
            hasChanges = true;
        }
        if (hasChanges) {
            yield album.save();
            yield HistoryActionService_1.HistoryActionService.create(userId, content);
        }
        return "update thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi sửa album: " + e);
    }
});
const addSongToAlbum = (song_ids, album_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const album = yield Album_model_1.default.findById(album_id);
        if (!album) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy album.");
        }
        const validSongs = [];
        for (const id of song_ids) {
            const song = yield Song_model_1.default.findById(id);
            if (!song) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Bài hát với ID ${id} không tồn tại.`);
            }
            validSongs.push(song);
        }
        const newIds = validSongs.map(song => song._id.toString());
        const currentIds = album.songs.map(id => id.toString());
        const sameLength = newIds.length === currentIds.length;
        const allNewInCurrent = sameLength && newIds.every(id => currentIds.includes(id));
        if (sameLength && allNewInCurrent) {
            return "Không có thay đổi trong danh sách bài hát.";
        }
        album.songs = validSongs.map(song => song._id);
        yield album.save();
        const addedSongTitles = validSongs.map(song => song.title || song._id.toString());
        const history = `Cập nhật bài hát của album ${album_id} thành: [${addedSongTitles.join(", ")}]`;
        yield HistoryActionService_1.HistoryActionService.create(userId, history);
        return "Đã cập nhật danh sách bài hát của album.";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật bài hát: " + e.message);
    }
});
const deletedAlbum = (album_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield Album_model_1.default.findByIdAndDelete(album_id);
        if (!deleted) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy album để xóa.");
        }
        yield HistoryActionService_1.HistoryActionService.create(userId, "Đã xóa album: " + album_id);
        return "Xóa thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xóa bài nhạc: " + e);
    }
});
const getAlbumForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const albums = yield Album_model_1.default.find();
    if (!albums || albums.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Không tìm thấy album nào.");
    }
    const albumResponsors = [];
    for (const album of albums) {
        const artist = yield Artist_model_1.default.findById(album.artist);
        if (!artist) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy nghệ sĩ");
        }
        const albumResponsor = {
            _id: album.id,
            album_name: album.album_name,
            decription: (_a = album.decription) !== null && _a !== void 0 ? _a : "",
            release_day: album.release_day,
            avatar: (_b = album.avatar) !== null && _b !== void 0 ? _b : "",
            artist: {
                _id: artist._id.toString(),
                name: artist.name,
                imageUrl: (_c = artist.imageUrl) !== null && _c !== void 0 ? _c : ""
            },
            songs: []
        };
        for (const song of album.songs) {
            const tmp = yield Song_model_1.default.findById(song);
            if (!tmp) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy bài hát");
            }
            albumResponsor.songs.push({
                _id: tmp._id.toString(),
                title: tmp.title,
                avatar: tmp.avatar
            });
        }
        albumResponsors.push(albumResponsor);
    }
    return albumResponsors;
});
const getAllAlbumservice = () => __awaiter(void 0, void 0, void 0, function* () {
    const albums = yield Album_model_1.default.find().populate('artist', 'name');
    if (!albums || albums.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No albums found.");
    }
    return albums;
});
const getAlbumByIdService = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    const albums = yield Album_model_1.default.findById(albumId)
        .populate('artist', 'name')
        .populate({
        path: 'songs',
        model: 'Song',
        select: 'audio avatar title',
        populate: {
            path: 'artist',
            model: 'Artist',
            select: 'name',
        },
    });
    if (!albums) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Album not found.");
    }
    return albums;
});
exports.AlbumService = {
    create,
    getAlbum,
    updateAlbum,
    deletedAlbum,
    addSongToAlbum,
    getAllAlbumservice,
    getAlbumByIdService,
    getAlbumForAdmin
};
