import {Request, Response, NextFunction } from "express";
import { HistoryService } from "../services/historyService";
import { StatusCodes } from "http-status-codes";

const getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.jwtDecoded.userInfo._id
        const response = await HistoryService.getHistoryService(userId)
        res.status(StatusCodes.OK).json(response)
    } catch (error) {
        next(error)
    }
}
export const HistotyController = {
    getHistory
}