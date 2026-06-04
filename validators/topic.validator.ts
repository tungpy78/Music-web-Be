import { body, param, query } from "express-validator"
const getTopicById = [
  param("topicId")
  .isMongoId()
  .withMessage("Topic ID không hợp lệ")
  .notEmpty()
  .withMessage("Topic ID không được để trống"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page phải là số nguyên lớn hơn hoặc bằng 1"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit phải là số nguyên lớn hơn hoặc bằng 1"),
]

const createTopic = [
  body("title")
    .notEmpty()
    .withMessage("Title không được để trống"),

  body("description")
    .notEmpty()
    .withMessage("Description không được để trống"),

  body("fileAvata")
    .custom((value, { req }) => {
      if (!req.files || !req.files["fileAvata"] || req.files["fileAvata"].length === 0) {
        throw new Error("Avatar không được để trống");
      }
      return true;
    })
];

const updateTopic = [
  body("title")
    .notEmpty()
    .withMessage("Title không được để trống"),

  body("description")
    .notEmpty()
    .withMessage("Description không được để trống"),

  param( "topicId")
    .isMongoId().withMessage("Topic ID không hợp lệ")
    .notEmpty().withMessage("Topic ID không được để trống"),
];

const deletedtopic = [
  param( "topicId")
    .isMongoId().withMessage("Topic ID không hợp lệ")
    .notEmpty().withMessage("Topic ID không được để trống")
]
export const topicValidators = {
    getTopicById,
    createTopic,
    updateTopic,
    deletedtopic
}   