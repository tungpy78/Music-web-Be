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
const toggleFavoriteValidator = [
    (0, express_validator_1.param)("songid")
        .notEmpty().withMessage("Song ID không được để trống")
        .isMongoId().withMessage("Song ID không hợp lệ"),
];
const addSongIntoPlayListValidator = [
    (0, express_validator_1.param)("playListId")
        .notEmpty().withMessage("PlayList ID không được để trống")
        .isMongoId().withMessage("PlayList ID không hợp lệ"),
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
exports.songValidators = {
    getSongValidator,
    searchSongValidator,
    toggleFavoriteValidator,
    addSongIntoPlayListValidator,
    createPlayListValidator,
    addHistorySongValidator
};
