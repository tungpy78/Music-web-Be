import { body } from "express-validator";

const loginValidator = [
    body("phone")
    .notEmpty().withMessage("Số điện thoại không được để trống")
    .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
    body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
]
const registerValidator = [
    body("fullname")
    .notEmpty().withMessage("Họ tên không được để trống")
    .isLength({ min: 6 }).withMessage("Họ tên phải có ít nhất 6 ký tự"),
    body("phone")
    .notEmpty().withMessage("Số điện thoại không được để trống")
    .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
    body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ"),
    body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
]
const changePasswordValidator = [
    body("oldPassword")
    .notEmpty().withMessage("Mật khẩu cũ không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu cũ phải có ít nhất 6 ký tự"),
    body("newPassword")
    .notEmpty().withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu mới phải có ít nhất 6 ký tự")
]
const changeProfileValidator = [
    body("phone")
    .notEmpty().withMessage("Số điện thoại không được để trống")
    .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
    body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ"),
]
const sendOtpValidator = [
    body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ"),
]
const verifyOtpValidator = [
    body("otp")
    .notEmpty().withMessage("Mã OTP không được để trống")
    .isLength({ min: 6 }).withMessage("Mã OTP phải có ít nhất 6 ký tự"),
    body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ"),
]
const resetPasswordValidator = [
    body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ"),
    body("newPassword")
    .notEmpty().withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
]

export const authValidators = {
    loginValidator,
    registerValidator,
    changePasswordValidator,
    changeProfileValidator,
    sendOtpValidator,
    verifyOtpValidator,
    resetPasswordValidator
}