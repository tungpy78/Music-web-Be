import { Request, Response, NextFunction } from "express"
import { HistoryActionService } from "../services/HistoryActionService"
import { StatusCodes } from "http-status-codes"


const getHistoryAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await HistoryActionService.getHistoryAction()
        res.status(StatusCodes.OK).json(response)
    } catch (error) {
        next(error)
    }
}
export const HistotyActionController = {
    getHistoryAction
}