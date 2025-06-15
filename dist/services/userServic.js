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
const User_model_1 = __importDefault(require("../models/User.model"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const JwtProvider_1 = require("../providers/JwtProvider");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Account_model_1 = __importDefault(require("../models/Account.model"));
const generateOTP_1 = require("../Utils/generateOTP");
const Redis_1 = require("../Utils/Redis");
const sendEmail_1 = require("../Utils/sendEmail");
const inspector_1 = require("inspector");
const loginService = (phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Account_model_1.default.findOne({ phone, deleted: false, status: "active" })
        .select("+password")
        .populate("role_id", "role_name");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    const isValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Sai mật khẩu ");
    }
    const roleDoc = user.role_id;
    const payload = {
        userId: userInfo._id,
        username: user.username,
        phone: user.phone,
        role: (roleDoc === null || roleDoc === void 0 ? void 0 : roleDoc.role_name) || "user",
        fullname: userInfo.fullname,
        email: userInfo.email,
    };
    const accessToken = yield JwtProvider_1.JwtProvider.generateToken(payload, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, "1h");
    const refreshToken = yield JwtProvider_1.JwtProvider.generateToken(payload, process.env.REFRESH_TOKEN_SECRET_SIGNATURE, "14 days");
    return {
        payload,
        accessToken,
        refreshToken
    };
});
const registerService = (fullname, email, phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExists = yield User_model_1.default.findOne({ email });
    if (emailExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Email đã tồn tại");
    }
    const phoneExists = yield Account_model_1.default.findOne({ phone });
    if (phoneExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Số điện thoại đã tồn tại");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newAccount = yield Account_model_1.default.create({
        username: phone,
        password: hashedPassword,
        phone: phone,
    });
    const newUser = yield User_model_1.default.create({
        fullname,
        email,
        account_id: newAccount._id
    });
    return {
        message: "Đăng ký thành công",
    };
});
const changePasswordService = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (oldPassword === newPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mật khẩu mới không được giống mật khẩu cũ");
    }
    const user = yield User_model_1.default.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const account = yield Account_model_1.default.findById(user.account_id);
    if (!account) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
    }
    const isValid = yield bcrypt_1.default.compare(oldPassword, account.password);
    if (!isValid) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Sai mật khẩu ");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield Account_model_1.default.updateOne({ _id: account._id }, { $set: { password: hashedPassword } });
    return {
        message: "Đổi mật khẩu thành công",
    };
});
const changeProfileService = (userId, email, phone) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !phone) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin");
    }
    const user = yield User_model_1.default.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const account = yield Account_model_1.default.findOne({ _id: user.account_id });
    if (!account) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
    }
    if (user.email === email && account.phone === phone) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Thông tin không thay đổi");
    }
    if (user.email !== email) {
        const emailExists = yield User_model_1.default.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Email đã tồn tại");
        }
    }
    if (account.phone !== phone) {
        const phoneExists = yield Account_model_1.default.findOne({ phone });
        if (phoneExists && phoneExists._id.toString() !== account._id.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Số điện thoại đã tồn tại");
        }
    }
    if (user.email !== email) {
        user.email = email;
        yield user.save();
    }
    if (account.phone !== phone) {
        account.phone = phone;
        yield account.save();
    }
    return {
        message: "Cập nhật thông tin thành công",
    };
});
const sendOtpService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const otp = (0, generateOTP_1.generateOTP)();
    const expireSeconds = 15;
    yield Redis_1.RedisService.saveOTP(email, otp, expireSeconds);
    yield (0, sendEmail_1.sendMail)(email, "Mã xác thực OTP", `Mã OTP của bạn là: ${otp}`);
    return {
        message: "OTP đã được gửi đến email của bạn",
        expireSeconds
    };
});
const verifyOtpService = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const savedOtp = yield Redis_1.RedisService.getOTP(email);
    if (!savedOtp) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "OTP không hợp lệ hoặc đã hết hạn");
    }
    if (savedOtp !== otp) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mã OTP không chính xác");
    }
    yield Redis_1.RedisService.deleteOTP(email);
    return {
        message: "Xác thực OTP thành công",
    };
});
const resetPasswordService = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield Account_model_1.default.updateOne({ _id: user.account_id }, { $set: { password: hashedPassword } });
    return {
        message: "Mật khẩu đã được cập nhật thành công",
    };
});
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    inspector_1.console.log("refreshToken1", refreshToken);
    const refreshTokenDecoded = yield JwtProvider_1.JwtProvider.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_SIGNATURE);
    inspector_1.console.log("refreshTokenDecoded", refreshTokenDecoded);
    const user = refreshTokenDecoded.userInfo;
    inspector_1.console.log("user", user);
    const accessToken = yield JwtProvider_1.JwtProvider.generateToken(user, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, "1h");
    inspector_1.console.log("accessToken1", accessToken);
    return {
        accessToken
    };
});
exports.UserService = {
    loginService,
    refreshTokenService,
    registerService,
    sendOtpService,
    verifyOtpService,
    resetPasswordService,
    changePasswordService,
    changeProfileService
};
