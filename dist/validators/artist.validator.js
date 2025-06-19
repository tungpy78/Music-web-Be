"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistValidator = void 0;
const express_validator_1 = require("express-validator");
const createArtist = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Tên nghệ sĩ không được để trống")
        .isString().withMessage("Tên nghệ sĩ phải là chuỗi"),
    (0, express_validator_1.body)("fileAvata")
        .custom((value, { req }) => {
        var _a;
        if (!req.file && !((_a = req.files) === null || _a === void 0 ? void 0 : _a.fileAvata)) {
            throw new Error("Ảnh đại diện không được để trống");
        }
        return true;
    }),
];
const updateArtist = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Tên nghệ sĩ không được để trống")
        .isString().withMessage("Tên nghệ sĩ phải là chuỗi"),
    (0, express_validator_1.param)("artist_id")
        .isMongoId().withMessage("Artist ID không hợp lệ")
        .notEmpty().withMessage("Artist ID không được để trống")
];
const getArtistByIdValidator = [
    (0, express_validator_1.param)("artistId")
        .isMongoId().withMessage("Artist ID không hợp lệ")
        .notEmpty().withMessage("Artist ID không được để trống")
];
exports.ArtistValidator = {
    createArtist,
    updateArtist,
    getArtistByIdValidator
};
