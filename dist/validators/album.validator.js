"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumValidators = void 0;
const express_validator_1 = require("express-validator");
const createAlbumValidator = [
    (0, express_validator_1.body)("album_name")
        .notEmpty().withMessage("Tên album ko được để trống"),
    (0, express_validator_1.body)("decription")
        .notEmpty().withMessage("Mô tả album ko được để trống"),
    (0, express_validator_1.body)("release_day")
        .notEmpty().withMessage("Ngày phát hành album ko được để trống")
        .isISO8601().withMessage("Ngày phát hành không đúng định dạng YYYY-MM-DD"),
];
const updateAlbum = [
    (0, express_validator_1.body)("album_name")
        .notEmpty().withMessage("Tên album ko được để trống"),
    (0, express_validator_1.body)("decription")
        .notEmpty().withMessage("Mô tả album ko được để trống"),
    (0, express_validator_1.body)("release_day")
        .notEmpty().withMessage("Ngày phát hành album ko được để trống")
        .isISO8601().withMessage("Ngày phát hành không đúng định dạng YYYY-MM-DD"),
    (0, express_validator_1.param)("album_id")
        .isMongoId().withMessage("Album ID không hợp lệ")
        .notEmpty().withMessage("Album ID không được để trống")
];
const deletedAlbum = [
    (0, express_validator_1.param)("album_id")
        .isMongoId().withMessage("Album ID không hợp lệ")
        .notEmpty().withMessage("Album ID không được để trống")
];
const addSongToAlbum = [
    (0, express_validator_1.body)("song_id")
        .isMongoId().withMessage("Song ID không hợp lệ")
        .notEmpty().withMessage("Song id ko được để trống"),
    (0, express_validator_1.body)("album_id")
        .isMongoId().withMessage("Album ID không hợp lệ")
        .notEmpty().withMessage("Album id ko được để trống"),
];
const getAlbumByIdValidator = [
    (0, express_validator_1.param)("albumId")
        .isMongoId().withMessage("Album ID không hợp lệ")
        .notEmpty().withMessage("Album id không được để trống"),
];
exports.AlbumValidators = {
    createAlbumValidator,
    updateAlbum,
    deletedAlbum,
    addSongToAlbum,
    getAlbumByIdValidator
};
