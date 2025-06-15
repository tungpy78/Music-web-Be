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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const History_model_1 = __importDefault(require("../models/History.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const getHistoryService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const history = History_model_1.default.find({ userId: userId })
        .sort({ listenedAt: -1 })
        .populate({
        path: 'songId',
        populate: {
            path: 'artist',
        }
    });
    if (!history) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Danh sách trống");
    }
    return history;
});
exports.HistoryService = {
    getHistoryService
};
