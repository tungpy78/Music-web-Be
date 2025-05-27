"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRouter = void 0;
const express_1 = require("express");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const TopicController_1 = require("../../controllers/TopicController");
const router = (0, express_1.Router)();
router.post('/create', upload_1.default.fields([{ name: 'fileAvata', maxCount: 1 }]), TopicController_1.TopicController.create);
router.patch('/update/:topicId', upload_1.default.fields([{ name: 'fileAvata', maxCount: 1 }]), TopicController_1.TopicController.updateTopic);
router.patch('/delete/:topicId', TopicController_1.TopicController.deletedtopic);
router.patch('/restore/:topicId', TopicController_1.TopicController.restoretopic);
exports.TopicRouter = router;
