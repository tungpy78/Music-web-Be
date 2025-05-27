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
const create = (userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const historyAction = new HistoryAction_model_1.default();
        historyAction.userId = new mongoose_1.default.Types.ObjectId(userId);
        historyAction.content = content;
        yield historyAction.save();
        return "Thành công";
    }
    catch (e) {
        throw new Error("Lỗi khi thêm thay đổi: " + e);
    }
});
exports.HistoryActionService = {
    create
};
