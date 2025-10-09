"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const removeVietnameseTones_1 = require("../Utils/removeVietnameseTones");
const ArtistSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    search_name: { type: String },
    bio: String,
    imageUrl: String
}, { timestamps: true });
ArtistSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.search_name = (0, removeVietnameseTones_1.removeVietnameseTones)(this.name).toLowerCase();
    }
    next();
});
const Artist = mongoose_1.default.model('Artist', ArtistSchema, 'Artist');
exports.default = Artist;
