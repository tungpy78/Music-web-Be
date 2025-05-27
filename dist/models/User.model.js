"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    fullname: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    deletedAt: Date,
    account_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        unique: true,
        required: true,
    }
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", userSchema, "User");
exports.default = User;
