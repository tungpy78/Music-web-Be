import Artist from "../models/Artist.model";
import { AritistRequest } from "../Request/ArtistRequest"
import Cloudinary from "../Utils/Cloudinary";

const create = async (aritistRequest: AritistRequest) => {
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

const updateArtist = async(aritistRequest: AritistRequest, artist_id:string) => {
    try{
        const artist = await Artist.findById(artist_id);
        if(!artist){
            throw new Error("Không tìm thấy tác giả yêu cầu")
        }
        if(aritistRequest.fileAvata){
            const avatarUrl = await Cloudinary.uploadToCloudinary(aritistRequest.fileAvata, {
            resource_type: 'image',
            folder: 'songs/avatar',
            });
            artist.imageUrl = avatarUrl;
        }
        artist.name = aritistRequest.name
        artist.bio = aritistRequest.bio
        await artist.save()
        return " Cập nhập thành công"
    }catch(e){
        throw new Error("Lỗi khi update Artist: "+e);
    }
}
export const ArtistService = {
    create,
    getAllArtist,
    updateArtist
}