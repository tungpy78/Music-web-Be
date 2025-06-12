import { body, param } from "express-validator";
const createAlbumValidator = [
    body("album_name")
    .notEmpty().withMessage("Tên album ko được để trống"),
    body("decription")
    .notEmpty().withMessage("Mô tả album ko được để trống"),
    body("release_day")
    .notEmpty().withMessage("Ngày phát hành album ko được để trống")
     .isISO8601().withMessage("Ngày phát hành không đúng định dạng YYYY-MM-DD"),
]
const updateAlbum = [
    body("album_name")
    .notEmpty().withMessage("Tên album ko được để trống"),
    body("decription")
    .notEmpty().withMessage("Mô tả album ko được để trống"),
    body("release_day")
    .notEmpty().withMessage("Ngày phát hành album ko được để trống")
     .isISO8601().withMessage("Ngày phát hành không đúng định dạng YYYY-MM-DD"),
    param("album_id")
    .isMongoId().withMessage("Album ID không hợp lệ")
    .notEmpty().withMessage("Album ID không được để trống")
]

const deletedAlbum = [
    param("album_id")
    .isMongoId().withMessage("Album ID không hợp lệ")
    .notEmpty().withMessage("Album ID không được để trống")
]

const addSongToAlbum = [
    body("song_id")
    .isMongoId().withMessage("Song ID không hợp lệ")
    .notEmpty().withMessage("Song id ko được để trống"),
    body("album_id")
    .isMongoId().withMessage("Album ID không hợp lệ")
    .notEmpty().withMessage("Album id ko được để trống"),
]
export const AlbumValidators = {
    createAlbumValidator,
    updateAlbum,
    deletedAlbum,
    addSongToAlbum
}