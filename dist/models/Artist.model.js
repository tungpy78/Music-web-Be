"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ArtistSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    bio: String,
    imageUrl: String
}, { timestamps: true });
const Artist = mongoose_1.default.model('Artist', ArtistSchema, 'Artist');
exports.default = Artist;
