import Topic from "../models/Topic.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../Utils/AppError";
import Song from "../models/Song.model";
import mongoose from "mongoose";
import Artist from "../models/Artist.model";


const getTopicsService = async () => {  
    const topics = await Topic.find({ deleted: false });
    if (!topics || topics.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND,"No topics found.");
    }
    return topics;
}

const getTopicByIdService = async (topicId: string) => {

 
     // Chuyển sang ObjectId
     const topicObjectId = new mongoose.Types.ObjectId(topicId);

     const songs = await Song.find({
         genre: topicObjectId,
         deleted: false
     }).populate('artist', 'name').populate('genre', 'title')

     const nameTopic = await Topic.findById(topicObjectId).select('title').lean();
    
     
    if (!songs) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No songs found for this topic.");
    }
    return {
        songs,
        nameTopic
    };
}

export const TopicService = {
    getTopicsService,
    getTopicByIdService
}