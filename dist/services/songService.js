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
exports.SongService = void 0;
const http_status_codes_1 = require("http-status-codes");
const Song_model_1 = __importDefault(require("../models/Song.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const Favorite_model_1 = __importDefault(require("../models/Favorite.model"));
const Playlist_model_1 = __importDefault(require("../models/Playlist.model"));
const History_model_1 = __importDefault(require("../models/History.model"));
const ToSlug_1 = require("../Utils/ToSlug");
const removeVietnameseTones_1 = require("../Utils/removeVietnameseTones");
const Cloudinary_1 = __importDefault(require("../Utils/Cloudinary"));
const Artist_model_1 = __importDefault(require("../models/Artist.model"));
const Topic_model_1 = __importDefault(require("../models/Topic.model"));
const HistoryActionService_1 = require("./HistoryActionService");
const getSongService = (songId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield Song_model_1.default.findById(songId)
        .populate("artist")
        .populate("genre");
    const favorite = yield Favorite_model_1.default.find({
        songId: songId,
        userId: userId
    });
    const playList = yield Playlist_model_1.default.find({
        userId: userId,
        "songs.songId": songId
    });
    const allPlayList = yield Playlist_model_1.default.find({ userId });
    if (!song) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
    }
    return {
        song,
        favorite,
        playList,
        allPlayList
    };
});
const getAllSongsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield Song_model_1.default.find({ deleted: false }).sort({ like: -1 })
        .populate("artist")
        .populate("genre");
    return songs;
});
const getSongsByArtistService = (artist_id) => __awaiter(void 0, void 0, void 0, function* () {
    const artist = yield Artist_model_1.default.findById(artist_id);
    if (!artist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Artist not found");
    }
    const songs = yield Song_model_1.default.find({ artist: artist_id, deleted: false })
        .populate("artist");
    return songs;
});
const searchSongService = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!keyword || typeof keyword !== 'string') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Keyword is required and must be a string");
    }
    const keywordNoTone = (0, removeVietnameseTones_1.removeVietnameseTones)(keyword).toLowerCase();
    const allSongs = yield Song_model_1.default.find()
        .populate("artist")
        .populate("genre");
    const filteredSongs = allSongs.filter(song => {
        const titleNoTone = (0, removeVietnameseTones_1.removeVietnameseTones)(song.title).toLowerCase();
        const artistNameNoTone = song.artist && 'name' in song.artist
            ? (0, removeVietnameseTones_1.removeVietnameseTones)(song.artist.name).toLowerCase()
            : '';
        return titleNoTone.includes(keywordNoTone) || artistNameNoTone.includes(keywordNoTone);
    });
    return filteredSongs;
});
const toggleFavoriteService = (songId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield Favorite_model_1.default.findOne({ songId, userId });
    if (existing) {
        yield Favorite_model_1.default.deleteOne({ songId, userId });
        yield Song_model_1.default.updateOne({ _id: songId, like: { $gt: 0 } }, { $inc: { like: -1 } });
        return { status: false };
    }
    else {
        yield Favorite_model_1.default.create({ songId, userId });
        yield Song_model_1.default.updateOne({ _id: songId }, { $inc: { like: 1 } });
        return { status: true };
    }
});
const addSongIntoPlayListService = (songId, userId, playListId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPlaylist = yield Playlist_model_1.default.findOne({
        _id: new mongoose_1.default.Types.ObjectId(playListId),
        userId: new mongoose_1.default.Types.ObjectId(userId),
        'songs.songId': new mongoose_1.default.Types.ObjectId(songId)
    });
    if (existingPlaylist) {
        return {
            message: "Bài hát đã tồn tại trong PlayList."
        };
    }
    const addSongPlayList = yield Playlist_model_1.default.updateOne({
        _id: new mongoose_1.default.Types.ObjectId(playListId),
        userId: new mongoose_1.default.Types.ObjectId(userId),
        'songs.songId': { $ne: new mongoose_1.default.Types.ObjectId(songId) }
    }, {
        $push: {
            songs: { songId: new mongoose_1.default.Types.ObjectId(songId) }
        }
    });
    if (addSongPlayList.modifiedCount > 0) {
        return {
            message: "Thêm vào PlayList thành công."
        };
    }
    else {
        return {
            message: "Bài hát đã tồn tại hoặc playlist không tồn tại."
        };
    }
});
const createPlayListService = (songId, userId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPlaylist = yield Playlist_model_1.default.findOne({ name, userId });
    if (existingPlaylist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'Playlist với tên này đã tồn tại!');
    }
    const createPlayList = yield Playlist_model_1.default.create({
        name,
        userId,
        songs: [{ songId }]
    });
    return createPlayList;
});
const addHistoryService = (songId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield History_model_1.default.findOne({ songId: songId, userId: userId });
    if (existing) {
        yield History_model_1.default.updateOne({ _id: existing._id }, { $set: { listenedAt: new Date() } });
    }
    else {
        yield History_model_1.default.create({ songId, userId });
    }
    return {
        message: "Thêm vào History thành công"
    };
});
const addNewSong = (userId, songRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const audioUrl = yield Cloudinary_1.default.uploadToCloudinary(songRequest.fileaudio, {
            resource_type: 'video',
            folder: 'songs/audio',
        });
        const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(songRequest.fileavatar, {
            resource_type: 'image',
            folder: 'songs/avatar',
        });
        const artist = yield Artist_model_1.default.findById(songRequest.artist);
        if (!artist) {
            throw new Error("Tác giả không tồn tại");
        }
        const genre = yield Topic_model_1.default.findById(songRequest.genre);
        if (!genre) {
            throw new Error("Không có thể loại tương ứng");
        }
        const song = new Song_model_1.default();
        Object.assign(song, Object.assign(Object.assign({}, songRequest), { artist: new mongoose_1.default.Types.ObjectId(songRequest.artist), genre: new mongoose_1.default.Types.ObjectId(songRequest.genre), audio: audioUrl, avatar: avatarUrl }));
        song.slug = (0, ToSlug_1.toSlug)(songRequest.title);
        const saveSong = yield song.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Thêm bài hát mới: " + song.id);
        return "Thêm thành công ";
    }
    catch (e) {
        throw new Error("Lỗi khi thêm nhạc: " + e);
    }
});
const updateSong = (userId, songRequest, song_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_model_1.default.findById(song_id);
        if (!song) {
            throw new Error("Không tìm thấy bài hát tương ứng: ");
        }
        const artist = yield Artist_model_1.default.findById(songRequest.artist);
        if (!artist) {
            throw new Error("Tác giả không tồn tại");
        }
        const genre = yield Topic_model_1.default.findById(songRequest.genre);
        if (!genre) {
            throw new Error("Không có thể loại tương ứng");
        }
        let content = `Đã thay đổi các thuộc tính của song ${song_id}:\n`;
        let hasChanges = false;
        if (songRequest.fileavatar) {
            const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(songRequest.fileavatar, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            content += `- Ảnh đại diện: ${song.avatar} -> ${avatarUrl}\n`;
            song.avatar = avatarUrl;
            hasChanges = true;
        }
        if (songRequest.fileaudio) {
            const audioUrl = yield Cloudinary_1.default.uploadToCloudinary(songRequest.fileaudio, {
                resource_type: 'video',
                folder: 'songs/audio',
            });
            content += `- Audio: ${song.audio} -> ${audioUrl}\n`;
            song.audio = audioUrl;
            hasChanges = true;
        }
        if (songRequest.title !== song.title) {
            content += `- Tiêu đề: ${song.title} -> ${songRequest.title}\n`;
            song.title = songRequest.title;
            song.slug = (0, ToSlug_1.toSlug)(songRequest.title);
            hasChanges = true;
        }
        if (songRequest.description !== song.description) {
            content += `- Mô tả: ${song.description} -> ${songRequest.description}\n`;
            song.description = songRequest.description;
            hasChanges = true;
        }
        if (songRequest.lyrics !== song.lyrics) {
            content += `- Lời bài hát: ${song.lyrics} -> ${songRequest.lyrics}\n`;
            song.lyrics = songRequest.lyrics;
            hasChanges = true;
        }
        const newArtistId = new mongoose_1.default.Types.ObjectId(songRequest.artist);
        if (song.artist.toString() !== newArtistId.toString()) {
            content += `- Tác giả: ${song.artist} -> ${newArtistId}\n`;
            song.artist = newArtistId;
            hasChanges = true;
        }
        const newGenreId = new mongoose_1.default.Types.ObjectId(songRequest.genre);
        if (song.genre.toString() !== newGenreId.toString()) {
            content += `- Thể loại: ${song.genre} -> ${newGenreId}\n`;
            song.genre = newGenreId;
            hasChanges = true;
        }
        if (hasChanges) {
            yield song.save();
            yield HistoryActionService_1.HistoryActionService.create(userId, content);
        }
        return "update thành công";
    }
    catch (e) {
        throw new Error("Lỗi khi thay đổi thông tin: " + e);
    }
});
const deletedsong = (userId, song_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_model_1.default.findById(song_id);
        if (!song) {
            throw new Error("Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = true;
        yield song.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Đã xóa bài hát: " + song_id);
        return "Xóa thành công";
    }
    catch (e) {
        throw new Error("Lỗi khi xóa bài nhạc: " + e);
    }
});
const restoresong = (song_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_model_1.default.findById(song_id);
        if (!song) {
            throw new Error("Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = false;
        yield song.save();
        return "Khôi phục thành công";
    }
    catch (e) {
        throw new Error("Lỗi khi xóa bài nhạc: " + e);
    }
});
exports.SongService = {
    getSongService,
    getAllSongsService,
    getSongsByArtistService,
    toggleFavoriteService,
    addSongIntoPlayListService,
    createPlayListService,
    addHistoryService,
    addNewSong,
    searchSongService,
    updateSong,
    deletedsong,
    restoresong
};
