"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historyScheme = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', require: true },
    songId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Song', require: true },
    listenedAt: { type: Date, default: Date.now }
});
const History = mongoose_1.default.model('History', historyScheme, 'History');
exports.default = History;
