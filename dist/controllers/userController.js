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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userServic_1 = require("../services/userServic");
const http_status_codes_1 = require("http-status-codes");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, password } = req.body;
        const response = yield userServic_1.UserService.loginService(phone, password);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, phone, email, password } = req.body;
        const response = yield userServic_1.UserService.registerService(fullname, email, phone, password);
        console.log("response", response);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        next(error);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.jwtDecoded.userInfo.userId;
        console.log("userId", userId);
        console.log("req.jwtDecoded", req.jwtDecoded);
        const response = yield userServic_1.UserService.changePasswordService(userId, oldPassword, newPassword);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const changeProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, email } = req.body;
        const userId = req.jwtDecoded.userInfo.userId;
        console.log("userId", userId);
        const response = yield userServic_1.UserService.changeProfileService(userId, email, phone);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const response = yield userServic_1.UserService.sendOtpService(email);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const response = yield userServic_1.UserService.verifyOtpService(email, otp);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        const response = yield userServic_1.UserService.resetPasswordService(email, newPassword);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken;
        const response = yield userServic_1.UserService.refreshTokenService(refreshToken);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.UserController = {
    login,
    refreshToken,
    register,
    sendOtp,
    verifyOtp,
    resetPassword,
    changePassword,
    changeProfile
};
