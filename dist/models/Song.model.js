"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("./Artist.model");
const SongSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Artist', required: true },
    genre: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Topic', required: true },
    avatar: { type: String, required: true },
    audio: String,
    like: { type: Number, default: 0 },
    description: String,
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    slug: { type: String, required: true },
    lyrics: String,
    album: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Album' },
}, { timestamps: true });
const Song = mongoose_1.default.model('Song', SongSchema, "Songs");
exports.default = Song;
