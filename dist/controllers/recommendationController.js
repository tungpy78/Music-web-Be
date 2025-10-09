"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const recommendation_service_1 = require("../services/recommendation.service");
const inspector_1 = require("inspector");
const getUserRecommendations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        inspector_1.console.log("User ID từ JWT:", userId);
        const recommendations = yield (0, recommendation_service_1.getHomepageRecommendations)(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(recommendations);
    }
    catch (e) {
        next(e);
    }
});
const recommendation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid, excludeIds } = req.body;
        inspector_1.console.log("Song ID từ body:", songid);
        inspector_1.console.log("Exclude IDs từ body:", excludeIds);
        inspector_1.console.log("req.body:", req.body);
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield (0, recommendation_service_1.getRelatedSongs)(songid, userId, excludeIds);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.RecommendationController = {
    getUserRecommendations,
    recommendation
};
