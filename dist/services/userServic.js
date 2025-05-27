"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const Account_model_1 = __importDefault(require("../models/Account.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const JwtProvider_1 = require("../providers/JwtProvider");
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginService = (phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Account_model_1.default.findOne({ phone, deleted: false })
        .select("+password")
        .populate("role_id", "role_name");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    const isValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Sai mật khẩu ");
    }
    const roleDoc = user.role_id;
    const payload = {
        userId: user._id.toHexString(),
        username: user.username,
        phone: user.phone,
        role: (roleDoc === null || roleDoc === void 0 ? void 0 : roleDoc.role_name) || "user",
    };
    const accessToken = yield JwtProvider_1.JwtProvider.generateToken(payload, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, "1h");
    const refreshToken = yield JwtProvider_1.JwtProvider.generateToken(payload, process.env.REFRESH_TOKEN_SECRET_SIGNATURE, "14 days");
    return {
        payload,
        accessToken,
        refreshToken
    };
});
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("refreshToken1", refreshToken);
    const refreshTokenDecoded = yield JwtProvider_1.JwtProvider.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_SIGNATURE);
    console.log("refreshTokenDecoded", refreshTokenDecoded);
    const user = refreshTokenDecoded.userInfo;
    console.log("user", user);
    const accessToken = yield JwtProvider_1.JwtProvider.generateToken(user, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, "1h");
    console.log("accessToken1", accessToken);
    return {
        accessToken
    };
});
exports.UserService = {
    loginService,
    refreshTokenService
};
