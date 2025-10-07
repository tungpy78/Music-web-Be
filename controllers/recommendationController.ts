import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getHomepageRecommendations, getRelatedSongs } from "../services/recommendation.service";
import { console } from "inspector";

const getUserRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        console.log("User ID từ JWT:", userId); // Debug: In userId lấy từ JWT
        const recommendations = await getHomepageRecommendations(userId);
        res.status(StatusCodes.OK).json(recommendations);
    }
    catch (e) {
        next(e);
    }
}
const recommendation = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { songid, excludeIds } = req.body ;
        console.log("Song ID từ body:", songid); // Debug: In songId lấy từ body
        console.log("Exclude IDs từ body:", excludeIds); // Debug: In excludeIds lấy từ body
        console.log("req.body:", req.body); // Debug: In toàn bộ req.body để kiểm tra
        const userId = req.jwtDecoded.userInfo.userId;
        const result = await getRelatedSongs(songid,userId, excludeIds);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}
export const RecommendationController = {
    getUserRecommendations,
    recommendation
}