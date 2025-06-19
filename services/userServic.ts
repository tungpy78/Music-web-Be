import { StatusCodes } from "http-status-codes"
import User from "../models/User.model"
import ApiError from "../Utils/AppError"
import { JwtProvider } from "../providers/JwtProvider"
import { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt";
import Account from "../models/Account.model"
import { generateOTP } from "../Utils/generateOTP"
import { RedisService } from "../Utils/Redis"
import { sendMail } from "../Utils/sendEmail"
import { console } from "inspector"


const loginService = async (phone: string, password: string) => {

    const user = await Account.findOne({ phone, deleted: false , status: true })
        .select("+password")
        .populate("role_id", "role_name")   // join colection chỉ lấy field role_name

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    const userInfo = await User.findOne({ account_id: user._id });
    console.log("userInfo", userInfo)

    if (!userInfo) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Thông tin user không tồn tại");
    }


    // 2. So khớp mật khẩu
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Sai mật khẩu ");
    }

    const roleDoc = user.role_id as any;     // sau populate, role_id là object
    const payload = {
        userId:   userInfo._id,
        phone: user.phone,
        role:     roleDoc?.role_name || "user",
        fullname: userInfo.fullname,
        email: userInfo.email,
    };
    
    const accessToken = await JwtProvider.generateToken(
        payload,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        // "5 s"
        "1h"
    )

    const refreshToken = await JwtProvider.generateToken(
        payload,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
        // "15 s"
        "14 days"
    )

    return {
        payload,
        accessToken,
        refreshToken
    };
}
const registerService = async (fullname: string, email: string, phone: string, password: string) => {
    // Simulate registration logic
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            throw new ApiError(StatusCodes.CONFLICT, "Email đã tồn tại");
        }

        const phoneExists = await Account.findOne({ phone });
        if (phoneExists) {
            throw new ApiError(StatusCodes.CONFLICT, "Số điện thoại đã tồn tại");
        }
    
        // 3. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // 4. Tạo tài khoản
        const newAccount = await Account.create({
            username: phone,
            password: hashedPassword,
            phone: phone,   
        });
    
        // 5. Tạo thông tin người dùng (User)
        const newUser = await User.create({
            fullname,
            email,
            account_id: newAccount._id
        });
    
        return {
            message: "Đăng ký thành công",
        };
}

const changePasswordService = async (userId: string, oldPassword: string, newPassword: string) => {
    if(oldPassword === newPassword) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Mật khẩu mới không được giống mật khẩu cũ");
    } 
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const account = await Account.findById(user.account_id);
    if (!account) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
    }

    // 2. So khớp mật khẩu
    const isValid = await bcrypt.compare(oldPassword, account.password);
    if (!isValid) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Sai mật khẩu ");
    }

    // 3. Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Cập nhật mật khẩu trong tài khoản
    await Account.updateOne(
        { _id: account._id },
        { $set: { password: hashedPassword } }
    );

    return {
        message: "Đổi mật khẩu thành công",
    };
}

const changeProfileService = async (userId: string, email: string, phone: string) => {
    if (!email || !phone) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin");
    }   
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const account = await Account.findOne({ _id: user.account_id });
    if (!account) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
    }
    if(user.email === email && account.phone === phone) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Thông tin không thay đổi");
    }

    if(user.email !== email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            throw new ApiError(StatusCodes.CONFLICT, "Email đã tồn tại");
        }
    }

    if(account.phone !== phone) {
        const phoneExists = await Account.findOne({ phone });
        if (phoneExists && phoneExists._id.toString() !== account._id.toString()) {
            throw new ApiError(StatusCodes.CONFLICT, "Số điện thoại đã tồn tại");
        }
    }

    // 2. Cập nhật thông tin người dùng
    if (user.email !== email) {
        user.email = email;
        await user.save();
    }

    if (account.phone !== phone) {
        account.phone = phone;
        await account.save();
    }

    return {
        message: "Cập nhật thông tin thành công",
    };
}

const sendOtpService = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }

    // Generate OTP
    const otp = generateOTP();
    const expireSeconds = 180; // 5 phút

    await RedisService.saveOTP(email, otp, expireSeconds);

    // Send OTP email
    await sendMail(email, "Mã xác thực OTP", `Mã OTP của bạn là: ${otp}`);

    return {
        message: "OTP đã được gửi đến email của bạn",
        expireSeconds
    };
}
const verifyOtpService = async (email: string, otp: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }
    const savedOtp = await RedisService.getOTP(email);
    if (!savedOtp) {
        throw new ApiError(StatusCodes.NOT_FOUND, "OTP không hợp lệ hoặc đã hết hạn");
    }

    if (savedOtp !== otp) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Mã OTP không chính xác");
    }

    // Xóa OTP sau khi xác thực thành công
    await RedisService.deleteOTP(email);

    return {
        message: "Xác thực OTP thành công",
    };
}
const resetPasswordService = async (email: string, newPassword: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }   
    // 1. Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // 2. Cập nhật mật khẩu trong tài khoản
    await Account.updateOne(
        { _id: user.account_id },
        { $set: { password: hashedPassword } }
    );
    return {
        message: "Mật khẩu đã được cập nhật thành công",
    };
}

const refreshTokenService = async (refreshToken: string) => {
    console.log("refreshToken1", refreshToken)
    const refreshTokenDecoded = await JwtProvider.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string
    ) as JwtPayload
    console.log("refreshTokenDecoded", refreshTokenDecoded)
    const user = refreshTokenDecoded.userInfo
    console.log("user", user)
    
    

    const accessToken = await JwtProvider.generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        // "5 s"
        "1h"
    )
    console.log("accessToken1", accessToken)
    
    
    return {
        accessToken
    };
}
export const UserService = {
    loginService,
    refreshTokenService,
    registerService,
    sendOtpService,
    verifyOtpService,
    resetPasswordService,
    changePasswordService,
    changeProfileService
}
