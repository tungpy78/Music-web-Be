"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRouter = void 0;
const express_1 = require("express");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const TopicController_1 = require("../../controllers/TopicController");
const topic_validator_1 = require("../../validators/topic.validator");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/adminTopics', TopicController_1.TopicController.getTopicsForAdmin);
router.post('/create', upload_1.default.fields([{ name: 'fileAvata', maxCount: 1 }]), topic_validator_1.topicValidators.createTopic, authMiddleware_1.AuthMiddleware.validateRequest, TopicController_1.TopicController.create);
router.patch('/update/:topicId', upload_1.default.fields([{ name: 'fileAvata', maxCount: 1 }]), topic_validator_1.topicValidators.updateTopic, authMiddleware_1.AuthMiddleware.validateRequest, TopicController_1.TopicController.updateTopic);
router.patch('/delete/:topicId', topic_validator_1.topicValidators.deletedtopic, authMiddleware_1.AuthMiddleware.validateRequest, TopicController_1.TopicController.deletedtopic);
router.patch('/restore/:topicId', topic_validator_1.topicValidators.deletedtopic, authMiddleware_1.AuthMiddleware.validateRequest, TopicController_1.TopicController.restoretopic);
router.get('/adminTopics', TopicController_1.TopicController.getTopicsForAdmin);
exports.TopicRouter = router;
