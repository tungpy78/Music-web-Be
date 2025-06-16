import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'
import { TopicService } from "../services/TopicService";
import { TopicRuquest } from "../Request/TopicRequest";



const getTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TopicService.getTopicsService();
        
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

const getTopicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { topicId } = req.params;
        const result = await TopicService.getTopicByIdService(topicId);
        
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try{
         const userData = req.jwtDecoded;
        const userId = userData?.userInfo?.userId;
        const { title, description } = req.body;
        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };
        const topicRequest: TopicRuquest = {
            title,
            fileAvata: files.fileAvata[0].buffer,
            description,
        };
        const result = await TopicService.create(userId,topicRequest)
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}

const updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userData = req.jwtDecoded;
        const userId = userData?.userInfo?.userId;
        const {topicId} = req.params;
        const { title, description} = req.body;
        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };
        const topicRequest: TopicRuquest = {
            title,
            fileAvata: files?.fileAvata?.[0]?.buffer ?? null,
            description,
        };
        const result = await TopicService.updateTopic(userId,topicRequest,topicId)
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}

const deletedtopic = async (req:Request, res: Response, next:NextFunction) => {
    try{
        const userData = req.jwtDecoded;
        const userId = userData?.userInfo?.userId;
        const {topicId} = req.params;
        const result = await TopicService.deletedtopic(userId,topicId);
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}
const restoretopic = async (req:Request, res: Response, next:NextFunction) => {
    try{
        const {topicId} = req.params;
        const result = await TopicService.restoretopic(topicId);
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}

const getTopicsForAdmin = async (req:Request, res: Response, next:NextFunction) => {
    try{
        const result = await TopicService.getTopicsForAdmin();
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}


export const TopicController = {
    getTopics,
    getTopicById,
    create,
    updateTopic,
    deletedtopic,
    restoretopic,
    getTopicsForAdmin

}
