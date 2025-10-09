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
exports.testController = void 0;
const http_status_codes_1 = require("http-status-codes");
const contentBased_service_1 = require("../services/contentBased.service");
const testSessionRecsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { songid } = req.params;
    const userId = req.jwtDecoded.userInfo.userId;
    try {
        const recommendations = yield (0, contentBased_service_1.getContentBasedRecommendations)(songid);
        res.status(http_status_codes_1.StatusCodes.OK).json({ recommendations });
    }
    catch (error) {
        console.error("Lỗi khi lấy gợi ý dựa trên phiên nghe nhạc:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi máy chủ khi lấy gợi ý." });
    }
});
exports.testController = {
    testSessionRecsController
};
