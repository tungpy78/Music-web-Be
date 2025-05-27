"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicRoutes = void 0;
const express_1 = require("express");
const TopicController_1 = require("../../controllers/TopicController");
const router = (0, express_1.Router)();
router.get('/', TopicController_1.TopicController.getTopics);
router.get('/:topicId', TopicController_1.TopicController.getTopicById);
exports.topicRoutes = router;
