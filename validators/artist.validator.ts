import { body, param } from "express-validator";

const createArtist = [
  body("name")
    .notEmpty().withMessage("Tên nghệ sĩ không được để trống")
    .isString().withMessage("Tên nghệ sĩ phải là chuỗi"),


  body("fileAvata")
    .custom((value, { req }) => {
      if (!req.file && !req.files?.fileAvata) {
        throw new Error("Ảnh đại diện không được để trống");
      }
      return true;
    }),
];

const updateArtist = [
    body("name")
    .notEmpty().withMessage("Tên nghệ sĩ không được để trống")
    .isString().withMessage("Tên nghệ sĩ phải là chuỗi"),
    param("artist_id")
        .isMongoId().withMessage("Artist ID không hợp lệ")
        .notEmpty().withMessage("Artist ID không được để trống")
]

export const ArtistValidator ={
    createArtist,
    updateArtist
}
