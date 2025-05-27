import { StatusCodes } from "http-status-codes"
import User from "../models/user.model"
import ApiError from "../Utils/AppError"
import { JwtProvider } from "../providers/JwtProvider"
import { JwtPayload } from "jsonwebtoken";


const loginService = async (phone: string, password: string) => {
    
    const user = await User.findOne({
        phone: phone,
        password: password,
        deleted: false
    }).select("-password")
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND,"User not found or incorrect password")
    }
    
    const accessToken = await JwtProvider.generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        // "5 s"
        "1h"
    )

    const refreshToken = await JwtProvider.generateToken(
        user,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
        // "15 s"
        "14 days"
    )

    return {
        user,
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