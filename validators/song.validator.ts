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
const getSongsByArtistValidator = [
    param("artist_id")
    .notEmpty().withMessage("Artist ID không được để trống")
    .isMongoId().withMessage("Artist ID không hợp lệ"),
]
const toggleFavoriteValidator = [
    param("songid")
    .notEmpty().withMessage("Song ID không được để trống")
    .isMongoId().withMessage("Song ID không hợp lệ"),
]
const addSongIntoPlayListValidator = [
    param("songid")
    .notEmpty().withMessage("Song ID không được để trống1")
    .isMongoId().withMessage("Song ID không hợp lệ1"),
    body("playListId")
    .notEmpty().withMessage("playList ID không được để trống")
    .isMongoId().withMessage("playList ID không hợp lệ"),
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

const createSong = [
    body("title")
    .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
    .isString().withMessage("Tiêu đề bài hát phải là chuỗi"),

  body("description")
    .optional()
    .isString().withMessage("Mô tả phải là chuỗi"),

  body("lyrics")
    .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
    .optional()
    .isString().withMessage("Lời bài hát phải là chuỗi"),
    
  body("artist").customSanitizer(value => Array.isArray(value) ? value : [value]),
  body("artist")
    .isArray({ min: 1 }).withMessage("Danh sách nghệ sĩ không được để trống"),
  body("artist.*")
    .isMongoId().withMessage("Mỗi ID nghệ sĩ phải là MongoId hợp lệ"),

  body("genre")
    .isMongoId().withMessage("Genre ID không hợp lệ")
    .notEmpty().withMessage("Thể loại không được để trống")
    .isString().withMessage("Thể loại phải là chuỗi"),

  body("fileavatar")
    .custom((value, { req }) => {
      if (!req.files?.fileavatar) {
        throw new Error("Ảnh đại diện không được để trống");
      }
      return true;
    }),

  body("fileaudio")
    .custom((value, { req }) => {
      if (!req.files?.fileaudio) {
        throw new Error("File audio không được để trống");
      }
      return true;
    }),
]

const updateSong = [
    body("title")
    .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
    .isString().withMessage("Tiêu đề bài hát phải là chuỗi"),

  body("description")
    .optional()
    .isString().withMessage("Mô tả phải là chuỗi"),

  body("lyrics")
    .notEmpty().withMessage("Tiêu đề bài hát không được để trống")
    .optional()
    .isString().withMessage("Lời bài hát phải là chuỗi"),

  body("artist").customSanitizer(value => Array.isArray(value) ? value : [value]),
  body("artist")
    .isArray({ min: 1 }).withMessage("Danh sách nghệ sĩ không được để trống"),
  body("artist.*")
    .isMongoId().withMessage("Mỗi ID nghệ sĩ phải là MongoId hợp lệ"),

  body("genre")
    .isMongoId().withMessage("Genre ID không hợp lệ")
    .notEmpty().withMessage("Thể loại không được để trống")
    .isString().withMessage("Thể loại phải là chuỗi"),
    param( "song_id")
        .isMongoId().withMessage("Song ID không hợp lệ")
        .notEmpty().withMessage("Song ID không được để trống")
]

const deletedSong = [
  param( "song_id")
    .isMongoId().withMessage("Song ID không hợp lệ")
    .notEmpty().withMessage("Song ID không được để trống")
]
export const songValidators = {
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

}