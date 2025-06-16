import Topic from "../models/Topic.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../Utils/AppError";
import Song from "../models/Song.model";
import mongoose from "mongoose";
import Artist from "../models/Artist.model";
import { TopicRuquest } from "../Request/TopicRequest";
import Cloudinary from "../Utils/Cloudinary";
import { toSlug } from "../Utils/ToSlug";
import { HistoryActionService } from "./HistoryActionService";


const getTopicsService = async () => {  
    const topics = await Topic.find({ deleted: false });
    if (!topics || topics.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND,"No topics found.");
    }
    return topics;
}

const getTopicsForAdmin = async () => {  
    const topics = await Topic.find();
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

const create = async(userId: string, topicRequset: TopicRuquest) => {
    try{
        const avatarUrl = await Cloudinary.uploadToCloudinary(topicRequset.fileAvata, {
        resource_type: 'image',
        folder: 'songs/avatar',
        });
        const topic = new Topic();
        topic.avatar = avatarUrl;
        topic.title = topicRequset.title;
        topic.description = topicRequset.description;
        topic.slug = toSlug(topicRequset.title);
        await topic.save();
        await HistoryActionService.create(userId, "Thêm topic mới: "+ topic.id);
        return "thêm topic thành công"
    }catch(e){
        throw new Error("Lôi khi thêm thể loại: "+ e);
    }
}

const updateTopic = async(userId: string , topicRequset: TopicRuquest,topicId : string) => {
    try{
        const topic = await Topic.findById(topicId);
        if( !topic){
            throw new Error ("Không tìm thấy topic tương ứng");
        }
        let content = `Đã thay đổi các thuộc tính của topic ${topicId}:\n`;
;
        let hasChanges = false;
        
        if(topicRequset.fileAvata != null){
            const avatarUrl = await Cloudinary.uploadToCloudinary(topicRequset.fileAvata, {
            resource_type: 'image',
            folder: 'songs/avatar',
            });
            content += `- Ảnh đại diện: ${topic.avatar} -> ${avatarUrl}\n`;
            topic.avatar = avatarUrl;
            hasChanges = true;
        }

        if (topicRequset.title !== topic.title ) {
            content += `- Tiêu đề: ${topic.title} -> ${topicRequset.title}\n`;
            topic.title = topicRequset.title;
            topic.slug = toSlug(topicRequset.title);
            hasChanges = true;
        }
         
        if (topicRequset.description !== topic.description) {
            content += `- Mô tả: ${topic.description} -> ${topicRequset.description}\n`;
            topic.description = topicRequset.description;
            hasChanges = true;
        }
        
        if (hasChanges) {
            await topic.save();
            await HistoryActionService.create(userId, content);
        }
        return "update thành công"
    }catch(e){
        throw new Error("Lỗi khi sửa topic: "+e);
    }
}

const deletedtopic = async(userId: string, topicId: string) => {
    try{
        const topic = await Topic.findById(topicId);
        if(!topic){
            throw new Error("Không tìm thấy thể loại tương ứng: ");
        }
        topic.deleted = true;
        await topic.save();
        await HistoryActionService.create(userId,"Đã xóa topic: "+topicId);
        return "Xóa thành công"
    }catch(e){
        throw new Error("Lỗi khi xóa bài nhạc: "+e);
    }
}

const restoretopic = async(topicId: string) => {
    try{
        const topic = await Topic.findById(topicId);
        if(!topic){
            throw new Error("Không tìm thấy thể loại tương ứng: ");
        }
        topic.deleted = false;
        await topic.save();
        return "Khôi phục thành công"
    }catch(e){
        throw new Error("Lỗi khi xóa bài nhạc: "+e);
    }
}


export const TopicService = {
    getTopicsService,
    getTopicByIdService,
    create,
    updateTopic,
    deletedtopic,
    restoretopic,
    getTopicsForAdmin
}