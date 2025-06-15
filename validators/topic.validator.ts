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