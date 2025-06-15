"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historyActionScheme = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', require: true },
    content: { type: String, require: true },
    listenedAt: { type: Date, default: Date.now }
});
const HistoryAction = mongoose_1.default.model('HistoryAction', historyActionScheme, 'HistoryAction');
exports.default = HistoryAction;
