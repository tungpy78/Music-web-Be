import {Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { favoriteService } from "../services/favoriteService";

const getFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.jwtDecoded.userInfo.userId
        const result = await favoriteService.getFavoriteService(userId)

        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}


export const favoriteController = {
    getFavorite
}