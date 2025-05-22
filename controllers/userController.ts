import {Request, Response, NextFunction } from "express";
import { UserService } from "../services/userServic";
import { StatusCodes } from "http-status-codes";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate login logic
        const { phone, password } = req.body;
        
        const response = await UserService.loginService(phone, password);
     
        res.status(StatusCodes.OK).json(response);
        
    } catch (error) {
        next(error);
    }
}
const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate registration logic
        const { fullname, phone, email, password } = req.body;

        const response = await UserService.registerService(fullname, email, phone, password);
        console.log("response", response);
        res.status(StatusCodes.CREATED).json(response);
        
    } catch (error) {
        next(error);
    }
}
const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate password change logic
        const {oldPassword, newPassword } = req.body;

        const userId = req.jwtDecoded.userInfo.userId;
        console.log("userId", userId);
        console.log("req.jwtDecoded", req.jwtDecoded);
        
        const response = await UserService.changePasswordService(userId, oldPassword, newPassword);

        res.status(StatusCodes.OK).json(response);
        
    } catch (error) {
        next(error);
    }
}

const changeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate profile change logic
        const { phone, email } = req.body;

        const userId = req.jwtDecoded.userInfo.userId;
        console.log("userId", userId);

        const response = await UserService.changeProfileService(userId, email, phone);

        res.status(StatusCodes.OK).json(response);
        
    } catch (error) {
        next(error);
    }
}

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate sending OTP logic
        
        const { email } = req.body;

        const response = await UserService.sendOtpService(email);

        res.status(StatusCodes.OK).json(response);
        
    } catch (error) {
        next(error);
    }
}
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate OTP verification logic
        const { email, otp } = req.body;

        const response = await UserService.verifyOtpService(email, otp);

        res.status(StatusCodes.OK).json(response);
        
    } catch (error) {
        next(error);
    }
}
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate password reset logic
        const { email, newPassword } = req.body;

        const response = await UserService.resetPasswordService(email, newPassword);

        res.status(StatusCodes.OK).json(response);

    } catch (error) {
        next(error);
    }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate refresh token logic
        const refreshToken = req.body.refreshToken;
        
        const response = await UserService.refreshTokenService(refreshToken);
        
        res.status(StatusCodes.OK).json(response);
        
    }
    catch (error) {
        next(error);
    }
}
export const UserController = {
    login,
    refreshToken,
    register,
    sendOtp,
    verifyOtp,
    resetPassword,
    changePassword,
    changeProfile
}   