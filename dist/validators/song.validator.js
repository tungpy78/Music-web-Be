"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songValidators = void 0;
const express_validator_1 = require("express-validator");
const getSongValidator = [
    (0, express_validator_1.param)("songid")
        .notEmpty().withMessage("Song ID không được để trống")
        .isMongoId().withMessage("Song ID không hợp lệ"),
];
const searchSongValidator = [
    (0, express_validator_1.query)("keyword")
        .notEmpty().withMessage("Keyword không được để trống")
        .isString().withMessage("Keyword phải là một chuỗi"),
];
const getSongsByArtistValidator = [
    (0, express_validator_1.param)("artist_id")
        .notEmpty().withMessage("Artist ID không được để trống")
        .isMongoId().withMessage("Artist ID không hợp lệ"),
];
const toggleFavoriteValidator = [
    (0, express_validator_1.param)("songid")
        .notEmpty().withMessage("Song ID không được để trống")
        .isMongoId().withMessage("Song ID không hợp lệ"),
];
const addSongIntoPlayListValidator = [
    (0, express_validator_1.param)("songid")
        .notEmpty().withMessage("Song ID không được để trống1")
        .isMongoId().withMessage("Song ID không hợp lệ1"),
    (0, express_validator_1.body)("playListId")
        .notEmpty().withMessage("playList ID không được để trống")
        .isMongoId().withMessage("playList ID không hợp lệ"),
];
const createPlayListValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Name không được để trống")
        .isString().withMessage("Name phải là một chuỗi"),
    (0, express_validator_1.param)("songid")
        .notEmpty().withMessage("Song ID không được để trống")
        .isMongoId().withMessage("Song ID không hợp lệ"),
];
const addHistorySongValidator = [
    (0, express_validator_1.param)("songid")
        .notEmpty().withMessage("Song ID không được để trống")
        .isMongoId().withMessage("Song ID không hợp lệ"),
];
const createSong = [
    (0, express_validator_1.body)("title")
        .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
        .isString().withMessage("Tiêu đề bài hát phải là chuỗi"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString().withMessage("Mô tả phải là chuỗi"),
    (0, express_validator_1.body)("lyrics")
        .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
        .optional()
        .isString().withMessage("Lời bài hát phải là chuỗi"),
    (0, express_validator_1.body)("artist").customSanitizer(value => Array.isArray(value) ? value : [value]),
    (0, express_validator_1.body)("artist")
        .isArray({ min: 1 }).withMessage("Danh sách nghệ sĩ không được để trống"),
    (0, express_validator_1.body)("artist.*")
        .isMongoId().withMessage("Mỗi ID nghệ sĩ phải là MongoId hợp lệ"),
    (0, express_validator_1.body)("genre")
        .isMongoId().withMessage("Genre ID không hợp lệ")
        .notEmpty().withMessage("Thể loại không được để trống")
        .isString().withMessage("Thể loại phải là chuỗi"),
    (0, express_validator_1.body)("fileavatar")
        .custom((value, { req }) => {
        var _a;
        if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.fileavatar)) {
            throw new Error("Ảnh đại diện không được để trống");
        }
        return true;
    }),
    (0, express_validator_1.body)("fileaudio")
        .custom((value, { req }) => {
        var _a;
        if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.fileaudio)) {
            throw new Error("File audio không được để trống");
        }
        return true;
    }),
];
const updateSong = [
    (0, express_validator_1.body)("title")
        .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
        .isString().withMessage("Tiêu đề bài hát phải là chuỗi"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString().withMessage("Mô tả phải là chuỗi"),
    (0, express_validator_1.body)("lyrics")
        .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
        .optional()
        .isString().withMessage("Lời bài hát phải là chuỗi"),
    (0, express_validator_1.body)("artist").customSanitizer(value => Array.isArray(value) ? value : [value]),
    (0, express_validator_1.body)("artist")
        .isArray({ min: 1 }).withMessage("Danh sách nghệ sĩ không được để trống"),
    (0, express_validator_1.body)("artist.*")
        .isMongoId().withMessage("Mỗi ID nghệ sĩ phải là MongoId hợp lệ"),
    (0, express_validator_1.body)("genre")
        .isMongoId().withMessage("Genre ID không hợp lệ")
        .notEmpty().withMessage("Thể loại không được để trống")
        .isString().withMessage("Thể loại phải là chuỗi"),
    (0, express_validator_1.param)("song_id")
        .isMongoId().withMessage("Song ID không hợp lệ")
        .notEmpty().withMessage("Song ID không được để trống")
];
const deletedSong = [
    (0, express_validator_1.param)("song_id")
        .isMongoId().withMessage("Song ID không hợp lệ")
        .notEmpty().withMessage("Song ID không được để trống")
];
exports.songValidators = {
    getSongValidator,
    searchSongValidator,
    getSongsByArtistValidator,
    toggleFavoriteValidator,
    addSongIntoPlayListValidator,
    createPlayListValidator,
    addHistorySongValidator,
    createSong,
    updateSong,
    deletedSong
};
