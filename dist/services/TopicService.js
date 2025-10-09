"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicService = void 0;
const Topic_model_1 = __importDefault(require("../models/Topic.model"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../Utils/AppError"));
const Song_model_1 = __importDefault(require("../models/Song.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const Cloudinary_1 = __importDefault(require("../Utils/Cloudinary"));
const ToSlug_1 = require("../Utils/ToSlug");
const HistoryActionService_1 = require("./HistoryActionService");
const getTopicsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield Topic_model_1.default.find({ deleted: false });
    if (!topics || topics.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No topics found.");
    }
    return topics;
});
const getTopicsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield Topic_model_1.default.find();
    if (!topics || topics.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No topics found.");
    }
    return topics;
});
const getTopicByIdService = (categoryId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const categoryObjectId = new mongoose_1.default.Types.ObjectId(categoryId);
    const query = {
        deleted: false,
        $or: [
            { genre: categoryObjectId },
            { topics: categoryObjectId }
        ]
    };
    const totalItems = yield Song_model_1.default.countDocuments(query);
    const songs = yield Song_model_1.default.find(query)
        .sort({ like: -1 })
        .skip(skip)
        .limit(limit)
        .populate('artist');
    const categoryInfo = yield Topic_model_1.default.findById(categoryId).select('title').lean();
    return {
        message: `Lấy danh sách bài hát cho category ${categoryId} thành công.`,
        data: songs,
        categoryName: (categoryInfo === null || categoryInfo === void 0 ? void 0 : categoryInfo.title) || '',
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit)
        }
    };
});
const create = (userId, topicRequset) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(topicRequset.fileAvata, {
            resource_type: 'image',
            folder: 'songs/avatar',
        });
        const topic = new Topic_model_1.default();
        topic.avatar = avatarUrl;
        topic.title = topicRequset.title;
        topic.description = topicRequset.description;
        topic.slug = (0, ToSlug_1.toSlug)(topicRequset.title);
        yield topic.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Thêm topic mới: " + topic.id);
        return "thêm topic thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lôi khi thêm thể loại: " + e);
    }
});
const updateTopic = (userId, topicRequset, topicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield Topic_model_1.default.findById(topicId);
        if (!topic) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy topic tương ứng");
        }
        let content = `Đã thay đổi các thuộc tính của topic ${topicId}:\n`;
        ;
        let hasChanges = false;
        if (topicRequset.fileAvata != null) {
            const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(topicRequset.fileAvata, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            content += `- Ảnh đại diện: ${topic.avatar} -> ${avatarUrl}\n`;
            topic.avatar = avatarUrl;
            hasChanges = true;
        }
        if (topicRequset.title !== topic.title) {
            content += `- Tiêu đề: ${topic.title} -> ${topicRequset.title}\n`;
            topic.title = topicRequset.title;
            topic.slug = (0, ToSlug_1.toSlug)(topicRequset.title);
            hasChanges = true;
        }
        if (topicRequset.description !== topic.description) {
            content += `- Mô tả: ${topic.description} -> ${topicRequset.description}\n`;
            topic.description = topicRequset.description;
            hasChanges = true;
        }
        if (hasChanges) {
            yield topic.save();
            yield HistoryActionService_1.HistoryActionService.create(userId, content);
        }
        return "update thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi sửa topic: " + e);
    }
});
const deletedtopic = (userId, topicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield Topic_model_1.default.findById(topicId);
        if (!topic) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy thể loại tương ứng: ");
        }
        topic.deleted = true;
        yield topic.save();
        yield HistoryActionService_1.HistoryActionService.create(userId, "Đã xóa topic: " + topicId);
        return "Xóa thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xóa bài nhạc: " + e);
    }
});
const restoretopic = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield Topic_model_1.default.findById(topicId);
        if (!topic) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy thể loại tương ứng: ");
        }
        topic.deleted = false;
        yield topic.save();
        return "Khôi phục thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xóa bài nhạc: " + e);
    }
});
exports.TopicService = {
    getTopicsService,
    getTopicByIdService,
    create,
    updateTopic,
    deletedtopic,
    restoretopic,
    getTopicsForAdmin
};
