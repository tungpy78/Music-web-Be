import { param } from "express-validator";
const getPlayListById = [
    param("playlistId")
    .isMongoId()
    .withMessage("Playlist ID không hợp lệ")    
    .notEmpty()
    .withMessage("Playlist ID không được để trống"),
]
const removeSongPlayList = [
    param("playlistId")
    .isMongoId().withMessage("Playlist ID không hợp lệ")
    .notEmpty().withMessage("Playlist ID không được để trống"),
    param("songId")
    .isMongoId().withMessage("Song ID không hợp lệ")
    .notEmpty().withMessage("Song ID không được để trống"),
]
const deletePlayList = [
    param("playlistId")
    .isMongoId().withMessage("Playlist ID không hợp lệ")
    .notEmpty().withMessage("Playlist ID không được để trống"),
]
export const playListValidators = {
    getPlayListById,
    removeSongPlayList,
    deletePlayList
}