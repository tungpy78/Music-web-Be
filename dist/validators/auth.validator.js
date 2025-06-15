"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidators = void 0;
const express_validator_1 = require("express-validator");
const loginValidator = [
    (0, express_validator_1.body)("phone")
        .notEmpty().withMessage("Số điện thoại không được để trống")
        .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Mật khẩu không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
];
const registerValidator = [
    (0, express_validator_1.body)("fullname")
        .notEmpty().withMessage("Họ tên không được để trống")
        .isLength({ min: 6 }).withMessage("Họ tên phải có ít nhất 6 ký tự"),
    (0, express_validator_1.body)("phone")
        .notEmpty().withMessage("Số điện thoại không được để trống")
        .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Mật khẩu không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
];
const changePasswordValidator = [
    (0, express_validator_1.body)("oldPassword")
        .notEmpty().withMessage("Mật khẩu cũ không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu cũ phải có ít nhất 6 ký tự"),
    (0, express_validator_1.body)("newPassword")
        .notEmpty().withMessage("Mật khẩu mới không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu mới phải có ít nhất 6 ký tự")
];
const changeProfileValidator = [
    (0, express_validator_1.body)("phone")
        .notEmpty().withMessage("Số điện thoại không được để trống")
        .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ"),
];
const sendOtpValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ"),
];
const verifyOtpValidator = [
    (0, express_validator_1.body)("otp")
        .notEmpty().withMessage("Mã OTP không được để trống")
        .isLength({ min: 6 }).withMessage("Mã OTP phải có ít nhất 6 ký tự"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ"),
];
const resetPasswordValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ"),
    (0, express_validator_1.body)("newPassword")
        .notEmpty().withMessage("Mật khẩu mới không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
];
exports.authValidators = {
    loginValidator,
    registerValidator,
    changePasswordValidator,
    changeProfileValidator,
    sendOtpValidator,
    verifyOtpValidator,
    resetPasswordValidator
};
