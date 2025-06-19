"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    password: { type: String, required: true },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^0\d{9,10}$/, 'Số điện thoại không hợp lệ']
    },
    role_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Role', required: true, default: new mongoose_1.default.Types.ObjectId("681b1c1327419f6f6416e116") },
    deleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
}, {
    timestamps: true
});
const Account = mongoose_1.default.model('Account', AccountSchema, "Account");
exports.default = Account;
