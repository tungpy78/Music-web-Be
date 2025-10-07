import {Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { favoriteService } from "../services/favoriteService";

const getFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20; // Mỗi lần tải 20 bài
        const userId = req.jwtDecoded.userInfo.userId
        const result = await favoriteService.getFavoriteService(userId, page, limit);

        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}


export const favoriteController = {
    getFavorite
}