"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playListValidators = void 0;
const express_validator_1 = require("express-validator");
const getPlayListById = [
    (0, express_validator_1.param)("playlistId")
        .isMongoId()
        .withMessage("Playlist ID không hợp lệ")
        .notEmpty()
        .withMessage("Playlist ID không được để trống"),
];
const removeSongPlayList = [
    (0, express_validator_1.param)("playlistId")
        .isMongoId().withMessage("Playlist ID không hợp lệ")
        .notEmpty().withMessage("Playlist ID không được để trống"),
    (0, express_validator_1.param)("songId")
        .isMongoId().withMessage("Song ID không hợp lệ")
        .notEmpty().withMessage("Song ID không được để trống"),
];
const deletePlayList = [
    (0, express_validator_1.param)("playlistId")
        .isMongoId().withMessage("Playlist ID không hợp lệ")
        .notEmpty().withMessage("Playlist ID không được để trống"),
];
exports.playListValidators = {
    getPlayListById,
    removeSongPlayList,
    deletePlayList
};
