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
exports.ArtistService = void 0;
const Artist_model_1 = __importDefault(require("../models/Artist.model"));
const Cloudinary_1 = __importDefault(require("../Utils/Cloudinary"));
const create = (aritistRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(aritistRequest.fileAvata, {
            resource_type: 'image',
            folder: 'songs/avatar',
        });
        const artist = new Artist_model_1.default();
        Object.assign(artist, Object.assign(Object.assign({}, aritistRequest), { imageUrl: avatarUrl }));
        yield artist.save();
        return "Thêm tác gia thành công";
    }
    catch (e) {
        throw new Error("Lỗi khi thêm tác giả: " + e);
    }
});
const getAllArtist = () => __awaiter(void 0, void 0, void 0, function* () {
    const artist = yield Artist_model_1.default.find();
    if (!artist || artist.length === 0) {
        throw new Error("No topics found.");
    }
    return artist;
});
const updateArtist = (aritistRequest, artist_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artist = yield Artist_model_1.default.findById(artist_id);
        if (!artist) {
            throw new Error("Không tìm thấy tác giả yêu cầu");
        }
        if (aritistRequest.fileAvata) {
            const avatarUrl = yield Cloudinary_1.default.uploadToCloudinary(aritistRequest.fileAvata, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            artist.imageUrl = avatarUrl;
        }
        artist.name = aritistRequest.name;
        artist.bio = aritistRequest.bio;
        yield artist.save();
        return " Cập nhập thành công";
    }
    catch (e) {
        throw new Error("Lỗi khi update Artist: " + e);
    }
});
exports.ArtistService = {
    create,
    getAllArtist,
    updateArtist
};
