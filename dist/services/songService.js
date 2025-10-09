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
const getPaginatedSongsService = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const totalSongs = yield Song_model_1.default.countDocuments({ deleted: false });
    const songs = yield Song_model_1.default.find({ deleted: false })
        .sort({ like: -1 })
        .skip(skip)
        .limit(limit)
        .populate("artist")
        .populate("genre");
    return {
        message: 'Lấy danh sách bài hát phân trang thành công',
        data: songs,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalSongs / limit),
            totalItems: totalSongs
        }
    };
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
    const keywordRegex = new RegExp(keywordNoTone, 'i');
    const songs = yield Song_model_1.default.aggregate([
        {
            $lookup: {
                from: 'Artist',
                localField: 'artist',
                foreignField: '_id',
                as: 'artistDetails'
            }
        },
        {
            $match: {
                $or: [
                    { search_title: keywordRegex },
                    { 'artistDetails.search_name': keywordRegex }
                ]
            }
        },
        {
            $lookup: {
                from: "Topics",
                localField: "genre",
                foreignField: "_id",
                as: "genreDetails"
            }
        },
        {
            $project: {
                title: 1,
                like: 1,
                avatar: 1,
                audio: 1,
                slug: 1,
                artist: "$artistDetails",
                genre: { $arrayElemAt: ["$genreDetails", 0] }
            }
        },
        {
            $sort: { like: -1 }
        },
        {
            $limit: 20
        }
    ]);
    return songs;
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
    if (!playListId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Phải chọn PlayList");
    }
    const playlist = yield Playlist_model_1.default.findOne({
        _id: new mongoose_1.default.Types.ObjectId(playListId),
        userId: new mongoose_1.default.Types.ObjectId(userId),
    });
    if (!playlist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Playlist không tồn tại.");
    }
    if (playlist.songs.length >= 20) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Playlist đã đạt tối đa 20 bài hát.");
    }
    const isExisted = playlist.songs.some(song => { var _a; return ((_a = song.songId) === null || _a === void 0 ? void 0 : _a.toString()) === songId; });
    if (isExisted) {
        return {
            message: "Bài hát đã tồn tại trong PlayList."
        };
    }
    playlist.songs.push({ songId: new mongoose_1.default.Types.ObjectId(songId) });
    yield playlist.save();
    return {
        message: "Thêm vào PlayList thành công."
    };
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
        const artistIds = [];
        for (const artistId of songRequest.artist) {
            const artist = yield Artist_model_1.default.findById(artistId);
            if (!artist) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `Tác giả không tồn tại: ${artistId}`);
            }
            artistIds.push(new mongoose_1.default.Types.ObjectId(artistId));
        }
        const genre = yield Topic_model_1.default.findById(songRequest.genre);
        if (!genre) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không có thể loại tương ứng");
        }
        const song = new Song_model_1.default();
        Object.assign(song, Object.assign(Object.assign({}, songRequest), { artist: artistIds, genre: new mongoose_1.default.Types.ObjectId(songRequest.genre), audio: audioUrl, avatar: avatarUrl }));
        song.slug = (0, ToSlug_1.toSlug)(songRequest.title);
        yield song.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Thêm bài hát mới: " + song.id);
        return "Thêm thành công ";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thêm nhạc: " + e);
    }
});
const updateSong = (userId, songRequest, song_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_model_1.default.findById(song_id);
        if (!song) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy bài hát tương ứng: ");
        }
        const artist = yield Artist_model_1.default.findById(songRequest.artist);
        if (!artist) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Tác giả không tồn tại");
        }
        const genre = yield Topic_model_1.default.findById(songRequest.genre);
        if (!genre) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không có thể loại tương ứng");
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
        const newArtistIds = [];
        for (const artistId of songRequest.artist) {
            const artist = yield Artist_model_1.default.findById(artistId);
            if (!artist) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `Tác giả không tồn tại: ${artistId}`);
            }
            newArtistIds.push(new mongoose_1.default.Types.ObjectId(artistId));
        }
        const oldArtistIds = song.artist.map((id) => id.toString());
        const newArtistIdsStr = newArtistIds.map(id => id.toString());
        const isDifferent = oldArtistIds.length !== newArtistIdsStr.length ||
            !oldArtistIds.every(id => newArtistIdsStr.includes(id));
        if (isDifferent) {
            content += `- Tác giả: [${oldArtistIds.join(', ')}] -> [${newArtistIdsStr.join(', ')}]\n`;
            song.artist = newArtistIds;
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
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thay đổi thông tin: " + e);
    }
});
const deletedsong = (userId, song_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_model_1.default.findById(song_id);
        if (!song) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = true;
        yield song.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Đã xóa bài hát: " + song_id);
        return "Xóa thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xóa bài nhạc: " + e);
    }
});
const restoresong = (song_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_model_1.default.findById(song_id);
        if (!song) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy bài hát tương ứng: ");
        }
        song.deleted = false;
        yield song.save();
        return "Khôi phục thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xóa bài nhạc: " + e);
    }
});
const getAllSongAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield Song_model_1.default.find()
        .populate("artist")
        .populate("genre");
    return songs;
});
exports.SongService = {
    getSongService,
    getPaginatedSongsService,
    getSongsByArtistService,
    toggleFavoriteService,
    addSongIntoPlayListService,
    createPlayListService,
    addHistoryService,
    addNewSong,
    searchSongService,
    updateSong,
    deletedsong,
    restoresong,
    getAllSongAdmin
};
