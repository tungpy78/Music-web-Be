import { StatusCodes } from "http-status-codes"
import User from "../models/Account.model"
import ApiError from "../Utils/AppError"
import { JwtProvider } from "../providers/JwtProvider"
import { JwtPayload } from "jsonwebtoken"
import Role from "../models/Role.model"
import bcrypt from "bcrypt";


const loginService = async (phone: string, password: string) => {
    
    const user = await User.findOne({ phone, deleted: false })
        .select("+password")                   
        .populate("role_id", "role_name");     // join colection chỉ lấy field role_name

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Sai mật khẩu ");
    }

    const roleDoc = user.role_id as any;     // sau populate, role_id là object
    const payload = {
        userId:   user._id.toHexString(),
        username: user.username,
        phone: user.phone,
        role:     roleDoc?.role_name || "user",
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
    refreshTokenService
}
