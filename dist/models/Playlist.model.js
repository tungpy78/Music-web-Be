"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PlaylistSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [
        {
            songId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Song' },
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
const Playlist = mongoose_1.default.model('Playlist', PlaylistSchema, "Playlist");
exports.default = Playlist;
