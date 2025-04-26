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
    refreshToken
}   