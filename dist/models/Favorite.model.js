"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FavoriteSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    songId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Song', required: true },
    addedAt: { type: Date, default: Date.now }
});
FavoriteSchema.index({ userId: 1, songId: 1 }, { unique: true });
const Favorite = mongoose_1.default.model('Favorite', FavoriteSchema, "Favorite");
exports.default = Favorite;
