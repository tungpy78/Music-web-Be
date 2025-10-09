"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationRouter = void 0;
const express_1 = require("express");
const recommendationController_1 = require("../../controllers/recommendationController");
const router = (0, express_1.Router)();
router.get('/homepage', recommendationController_1.RecommendationController.getUserRecommendations);
router.post('/related', recommendationController_1.RecommendationController.recommendation);
exports.recommendationRouter = router;
