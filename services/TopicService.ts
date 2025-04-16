import Topic from "../models/topic.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/AppError";

const getTopicsService = async () => {  
    const topics = await Topic.find({ deleted: false });
    if (!topics || topics.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND,"No topics found.");
    }
    return topics;
}
export const TopicService = {
    getTopicsService
}