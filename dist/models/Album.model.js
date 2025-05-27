"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AlbumSchema = new mongoose_1.default.Schema({
    album_name: { type: String, required: true, unique: true },
    release_day: { type: Date, required: true },
    decription: { type: String }
}, {
    timestamps: true
});
const Album = mongoose_1.default.model("Album", AlbumSchema, "Album");
exports.default = Album;
