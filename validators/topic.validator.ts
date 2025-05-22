import { param } from "express-validator"
const getTopicById = [
    param("topicId")
    .isMongoId()
    .withMessage("Topic ID không hợp lệ")
    .notEmpty()
    .withMessage("Topic ID không được để trống"),
]
export const topicValidators = {
    getTopicById
}   