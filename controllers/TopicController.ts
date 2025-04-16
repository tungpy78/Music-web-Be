import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'
import { TopicService } from "../services/TopicService";



const getTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TopicService.getTopicsService();
        
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
export const TopicController = {
    getTopics
}
