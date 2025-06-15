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
exports.TopicController = void 0;
const http_status_codes_1 = require("http-status-codes");
const TopicService_1 = require("../services/TopicService");
const getTopics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TopicService_1.TopicService.getTopicsService();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getTopicById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        const result = yield TopicService_1.TopicService.getTopicByIdService(topicId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = req.jwtDecoded;
        const userId = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { title, description } = req.body;
        const files = req.files;
        const topicRequest = {
            title,
            fileAvata: files.fileAvata[0].buffer,
            description,
        };
        const result = yield TopicService_1.TopicService.create(userId, topicRequest);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const updateTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userData = req.jwtDecoded;
        const userId = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { topicId } = req.params;
        const { title, description } = req.body;
        const files = req.files;
        if (!title) {
            res.status(400).json({ message: 'Thiếu trường bắt buộc: title', });
            return;
        }
        const topicRequest = {
            title,
            fileAvata: (_d = (_c = (_b = files === null || files === void 0 ? void 0 : files.fileAvata) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.buffer) !== null && _d !== void 0 ? _d : null,
            description,
        };
        const result = yield TopicService_1.TopicService.updateTopic(userId, topicRequest, topicId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const deletedtopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = req.jwtDecoded;
        const userId = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { topicId } = req.params;
        const result = yield TopicService_1.TopicService.deletedtopic(userId, topicId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const restoretopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        const result = yield TopicService_1.TopicService.restoretopic(topicId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
exports.TopicController = {
    getTopics,
    getTopicById,
    create,
    updateTopic,
    deletedtopic,
    restoretopic
};
