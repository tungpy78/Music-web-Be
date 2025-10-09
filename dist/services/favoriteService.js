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
exports.favoriteService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Favorite_model_1 = __importDefault(require("../models/Favorite.model"));
const getFavoriteService = (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const totalItems = yield Favorite_model_1.default.countDocuments({ userId: userObjectId });
    const favorites = yield Favorite_model_1.default.aggregate([
        { $match: { userId: userObjectId } },
        { $sort: { addedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: 'Songs',
                localField: 'songId',
                foreignField: '_id',
                as: 'songDetails'
            }
        },
        { $unwind: '$songDetails' },
        {
            $lookup: {
                from: 'Artist',
                localField: 'songDetails.artist',
                foreignField: '_id',
                as: 'songDetails.artist'
            }
        },
        { $replaceRoot: { newRoot: '$songDetails' } }
    ]);
    return {
        message: 'Lấy danh sách yêu thích thành công.',
        data: favorites,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems: totalItems
        }
    };
});
exports.favoriteService = {
    getFavoriteService
};
