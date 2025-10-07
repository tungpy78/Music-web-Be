import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes' 
import { getSessionBasedRecommendations } from "../services/sessionBased.service";
import { getCollaborativeRecommendations } from "../services/collaborative.service";
import { getContentBasedRecommendations } from "../services/contentBased.service";

const testSessionRecsController = async (req: Request, res: Response) => {
    const { songid } = req.params;
    const userId = req.jwtDecoded.userInfo.userId;
    try {
        const recommendations = await getContentBasedRecommendations(songid);
        res.status(StatusCodes.OK).json({ recommendations });
    } catch (error) {
        console.error("Lỗi khi lấy gợi ý dựa trên phiên nghe nhạc:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi máy chủ khi lấy gợi ý." });
    }
};

export const testController = {
    testSessionRecsController
};