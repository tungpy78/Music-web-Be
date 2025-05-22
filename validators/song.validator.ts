import { body, param,query } from "express-validator";
const getSongValidator = [
    param("songid")
    .notEmpty().withMessage("Song ID không được để trống")
    .isMongoId().withMessage("Song ID không hợp lệ"),
]
const searchSongValidator = [
    query("keyword")
    .notEmpty().withMessage("Keyword không được để trống")
    .isString().withMessage("Keyword phải là một chuỗi"),
]
const toggleFavoriteValidator = [
    param("songid")
    .notEmpty().withMessage("Song ID không được để trống")
    .isMongoId().withMessage("Song ID không hợp lệ"),
]
const addSongIntoPlayListValidator = [
    param("playListId")
    .notEmpty().withMessage("PlayList ID không được để trống")
    .isMongoId().withMessage("PlayList ID không hợp lệ"),
]
const createPlayListValidator = [
    body("name")
    .notEmpty().withMessage("Name không được để trống")
    .isString().withMessage("Name phải là một chuỗi"),
    param("songid")
    .notEmpty().withMessage("Song ID không được để trống")
    .isMongoId().withMessage("Song ID không hợp lệ"),
]
const addHistorySongValidator = [
    param("songid")
    .notEmpty().withMessage("Song ID không được để trống")
    .isMongoId().withMessage("Song ID không hợp lệ"),
]
export const songValidators = {
    getSongValidator,
    searchSongValidator,
    toggleFavoriteValidator,
    addSongIntoPlayListValidator,
    createPlayListValidator,
    addHistorySongValidator
}