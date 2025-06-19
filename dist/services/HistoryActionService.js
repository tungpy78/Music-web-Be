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
exports.HistoryActionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const HistoryAction_model_1 = __importDefault(require("../models/HistoryAction.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const http_status_codes_1 = require("http-status-codes");
const create = (userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const historyAction = new HistoryAction_model_1.default();
        historyAction.userId = new mongoose_1.default.Types.ObjectId(userId);
        historyAction.content = content;
        yield historyAction.save();
        return "Thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thêm thay đổi: " + e);
    }
});
const getHistoryAction = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield HistoryAction_model_1.default.find()
            .sort({ listenedAt: -1 })
            .populate({
            path: "userId",
            select: "fullname account_id",
            populate: {
                path: "account_id",
                select: "phone"
            }
        })
            .select("content userId listenedAt")
            .lean();
        return history.map(item => {
            var _a, _b, _c;
            return ({
                _id: item._id,
                content: item.content,
                user: ((_a = item.userId) === null || _a === void 0 ? void 0 : _a.fullname) || "Người dùng không xác định",
                phone: ((_c = (_b = item.userId) === null || _b === void 0 ? void 0 : _b.account_id) === null || _c === void 0 ? void 0 : _c.phone) || "Không có số điện thoại",
                listenedAt: item.listenedAt
            });
        });
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi lấy lịch sử: " + e);
    }
});
exports.HistoryActionService = {
    create,
    getHistoryAction
};
