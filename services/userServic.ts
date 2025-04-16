import { StatusCodes } from "http-status-codes"
import User from "../models/user.model"
import ApiError from "../utils/AppError"
import { JwtProvider } from "../providers/JwtProvider"

const loginService = async (phone: string, password: string) => {
    console.log("phone", phone)
    console.log("password", password)
    const user = await User.findOne({
        phone: phone,
        password: password,
        deleted: false
    })
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND,"User not found or incorrect password")
    }
    const userInfo = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
    }
    const genrateToken = await JwtProvider.generateToken(
        userInfo,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        "1h"
    )

    const refreshToken = await JwtProvider.generateToken(
        userInfo,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
        "14 days"
    )

    return {
        user,
        genrateToken,
        refreshToken
    };
}
export const UserService = {
    loginService
}