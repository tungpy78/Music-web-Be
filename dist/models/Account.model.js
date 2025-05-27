"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^0\d{9,10}$/, 'Số điện thoại không hợp lệ']
    },
    role_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Role', required: true },
    deleted: { type: Boolean, default: false }
}, {
    timestamps: true
});
const Account = mongoose_1.default.model('Account', AccountSchema, "Account");
exports.default = Account;
