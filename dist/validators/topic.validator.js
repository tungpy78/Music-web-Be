"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicValidators = void 0;
const express_validator_1 = require("express-validator");
const getTopicById = [
    (0, express_validator_1.param)("topicId")
        .isMongoId()
        .withMessage("Topic ID không hợp lệ")
        .notEmpty()
        .withMessage("Topic ID không được để trống"),
];
const createTopic = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title không được để trống"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description phải là chuỗi"),
    (0, express_validator_1.body)("fileAvata")
        .custom((value, { req }) => {
        if (!req.files || !req.files["fileAvata"] || req.files["fileAvata"].length === 0) {
            throw new Error("Avatar không được để trống");
        }
        return true;
    })
];
exports.topicValidators = {
    getTopicById,
    createTopic
};
