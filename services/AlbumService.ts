import mongoose, { now } from "mongoose";
import Album from "../models/Album.model";
import { AlbumRequest } from "../Request/AlbumRequest";
import { HistoryActionService } from "./HistoryActionService";
import Cloudinary from "../Utils/Cloudinary";
import Artist from "../models/Artist.model";
import Song from "../models/Song.model";
import { AlbumUpdateRequest } from "../Request/AlbumUpdateRequest";

const create = async(userId: string,albumRequest: AlbumRequest) => {
    try{
        const album = new Album()
        const artist = await Artist.findById(albumRequest.artist);
        if(!artist){
            throw new Error("Tác giả không tồn tại")
        }
        const avatarUrl = await Cloudinary.uploadToCloudinary(albumRequest.avatar, {
            resource_type: 'image',
            folder: 'songs/avatar',
        });
        album.avatar = avatarUrl;
        album.artist = new mongoose.Types.ObjectId(albumRequest.artist);
        for (let i = 0; i < albumRequest.songs.length; i++) {
            const song  = await Song.findById(albumRequest.songs[i]);
            if(!song){
                throw new Error("Bài hát không tồn tại")
            }
            album.songs.push(song._id)
        }
        album.album_name = albumRequest.album_name;
        album.decription = albumRequest.decription;
        album.release_day = albumRequest.release_day;
        await album.save();
        await HistoryActionService.create(userId,"Đã thêm Album mới: "+ album.id);
        return "Thêm thành công"
    }catch(e){
        throw new Error("Lỗi khi thêm Album: "+e);
    }
}

const getAlbum = async () => {
    const album = await Album.find();
    if(!album || album.length === 0 ){
         throw new Error("No albums found.");
    }
    return album;
}

const updateAlbum = async(albumUpdateRequest: AlbumUpdateRequest, album_id: string, userId: string) => {
    try{
        const album = await Album.findById(album_id);
        if(!album){
            throw new Error("Không tìm thấy Album tương ứng: "+ album_id);
        }
        let content =`Đã thay đổi các thuộc tính của Album ${album_id}:\n`;
        let hasChanges = false;
        
        if (albumUpdateRequest.avatar) {
            const avatarUrl = await Cloudinary.uploadToCloudinary(albumUpdateRequest.avatar, {
                resource_type: 'image',
                folder: 'songs/avatar',
            });
            content += `- Ảnh đại diện: ${album.avatar} -> ${avatarUrl}\n`;
            album.avatar = avatarUrl;
            hasChanges = true;
        }
        
        const artist = await Artist.findById(albumUpdateRequest.artist);
        if(!artist){
            throw new Error("Tác giả không tồn tại")
        }

        const newArtistId = new mongoose.Types.ObjectId(albumUpdateRequest.artist);
            if (album.artist.toString() !== newArtistId.toString()) {
                content += `- Tác giả: ${album.artist} -> ${newArtistId}\n`;
                album.artist = newArtistId;
                hasChanges = true;
            }

        if(album.album_name != albumUpdateRequest.album_name){
            album.album_name= albumUpdateRequest.album_name;
            content += `- Tên album: ${album.album_name} -> ${albumUpdateRequest.album_name}\n`;
            hasChanges = true;
        }
        if(album.decription != albumUpdateRequest.decription){
            album.decription = albumUpdateRequest.decription;
            content += `- Mô tả: ${album.decription} -> ${albumUpdateRequest.decription}\n`;
            hasChanges = true;
        }
        if(album.release_day != albumUpdateRequest.release_day){
            album.release_day = albumUpdateRequest.release_day;
            content += `- Ngày phát hành : ${album.release_day} -> ${albumUpdateRequest.release_day}\n`;
            hasChanges = true;
        }
        if (hasChanges) {
            await album.save();
            await HistoryActionService.create(userId, content);
        }
        return "update thành công"
    }catch( e){
        throw new Error("Lỗi khi sửa album: "+ e);
    }
}

const addSongToAlbum = async( song_id: string,album_id: string, userId: string) => {
    try {
        const album = await Album.findById(album_id);
        if (!album) {
            throw new Error("Không tìm thấy album.");
        }
        const song = await Song.findById(song_id);
        if (!song) {
            throw new Error("Không tìm thấy song.");
        }
        if (album.songs.includes(song._id)) {
            throw new Error("Bài hát đã tồn tại trong album.");
        }

        album.songs.push(song._id);

        await album.save();
        await HistoryActionService.create(userId, "thêm bài hát "+ song_id + " vào trong album "+ album_id);
        return "Đã thêm bài hát vào album thành công.";

    }catch(e){
        throw new Error("Lỗi khi xóa bài nhạc: "+e);
    }
}

const removeSongFromAlbum = async (song_id: string, album_id: string, userId: string) => {
  try {
    const album = await Album.findById(album_id);
    if (!album) {
      throw new Error("Không tìm thấy album.");
    }

    const song = await Song.findById(song_id);
    if (!song) {
      throw new Error("Không tìm thấy bài hát.");
    }

    const songIndex = album.songs.indexOf(song._id);
    if (songIndex === -1) {
      throw new Error("Bài hát không tồn tại trong album.");
    }
    album.songs.splice(songIndex, 1);
    await album.save();
    await HistoryActionService.create(userId, "xóa bài hát " + song_id + " khỏi album " + album_id);
    return "Đã xóa bài hát khỏi album thành công." ;
    
  } catch (e: any) {
    throw new Error("Lỗi khi xóa bài nhạc: " + e.message);
  }
};

const deletedAlbum = async(album_id: string, userId: string) => {
    try{
        const deleted = await Album.findByIdAndDelete(album_id);
        if (!deleted) {
            throw new Error("Không tìm thấy album để xóa.");
        }
        await HistoryActionService.create(userId, "Đã xóa album: " + album_id);
        return "Xóa thành công";
        }catch(e){
            throw new Error("Lỗi khi xóa bài nhạc: "+e);
        }
}

export const AlbumService ={
    create,
    getAlbum,
    updateAlbum,
    deletedAlbum,
    addSongToAlbum,
    removeSongFromAlbum
}