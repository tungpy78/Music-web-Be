import Artist from "../models/Artist.model";
import { AritistRequest } from "../Request/ArtistRequest"
import ApiError from "../Utils/AppError";
import Cloudinary from "../Utils/Cloudinary";
import { HistoryActionService } from "./HistoryActionService";

const create = async (userId: string,aritistRequest: AritistRequest) => {
    try{
        const avatarUrl = await Cloudinary.uploadToCloudinary(aritistRequest.fileAvata, {
        resource_type: 'image',
        folder: 'songs/avatar',
        });
        const artist = new Artist();
        Object.assign(artist, {
                    ...aritistRequest,
                    imageUrl: avatarUrl
                });
        await artist.save();
        await HistoryActionService.create(userId,"Thêm Aritist mới: " + artist.id);
        return "Thêm tác gia thành công"
    }catch(e){
        throw new Error("Lỗi khi thêm tác giả: "+e);
    }
}

const getAllArtist = async() =>{
    const artist = await Artist.find();
    if (!artist || artist.length === 0) {
        throw new Error("No topics found.");
    }
    return artist;
}

const updateArtist = async(userId: string, aritistRequest: AritistRequest, aritist_id:string) => {
    try{
        const artist = await Artist.findById(aritist_id);
        if(!artist){
            throw new Error("Không tìm thấy tác giả yêu cầu")
        }
        let content =`Đã thay đổi các thuộc tính của Aritist ${aritist_id}:\n`;
        let hasChanges = false;
        if(aritistRequest.fileAvata){
            const avatarUrl = await Cloudinary.uploadToCloudinary(aritistRequest.fileAvata, {
            resource_type: 'image',
            folder: 'songs/avatar',
            });
            artist.imageUrl = avatarUrl;
            content += `- Ảnh đại diện: ${artist.imageUrl} -> ${avatarUrl}\n`;
            hasChanges = true;
        }
        if( artist.name != aritistRequest.name){ 
            content += `- Tên : ${artist.name} -> ${aritistRequest.name}\n`;
            artist.name = aritistRequest.name
            hasChanges = true;
        }
        if( artist.bio != aritistRequest.bio){
            content += `- Bio : ${artist.bio} -> ${aritistRequest.bio}\n`;
            artist.bio = aritistRequest.bio
             hasChanges = true;
        }
       
        if (hasChanges) {
            await artist.save()
            await HistoryActionService.create(userId, content);
        }
        return " Cập nhập thành công"
    }catch(e){
        throw new Error("Lỗi khi update Artist: "+e);
    }
}
const getArtistByIdService = async (artistId: string) => {
    const artist = await Artist.findById(artistId).populate('songs').populate('albums');
    if (!artist) {
        throw new ApiError(404, "Không tìm thấy tác giả yêu cầu");
    }
    return artist;
};
export const ArtistService = {
    create,
    getAllArtist,
    updateArtist,
    getArtistByIdService 
}