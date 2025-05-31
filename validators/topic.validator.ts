import { body, param } from "express-validator"
const getTopicById = [
    param("topicId")
    .isMongoId()
    .withMessage("Topic ID không hợp lệ")
    .notEmpty()
    .withMessage("Topic ID không được để trống"),
]

const createTopic = [
  body("title")
    .notEmpty()
    .withMessage("Title không được để trống"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description phải là chuỗi"),

  body("fileAvata")
    .custom((value, { req }) => {
      if (!req.files || !req.files["fileAvata"] || req.files["fileAvata"].length === 0) {
        throw new Error("Avatar không được để trống");
      }
      return true;
    })
];

export const topicValidators = {
    getTopicById,
    createTopic
}   