import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AlbumService } from "../services/AlbumService";
import { AlbumRequest } from "../Request/AlbumRequest";
import { AlbumUpdateRequest } from "../Request/AlbumUpdateRequest";

const create = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.jwtDecoded.userInfo.userId;
        const {album_name, decription, release_day,artist,songs: rawSongs } = req.body;
        const songsArray = Array.isArray(rawSongs)
            ? rawSongs
            : rawSongs
            ? [rawSongs]
            : [];

        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };
        const albumRequest : AlbumRequest = {
            album_name: album_name,
            decription: decription,
            release_day: release_day,
            artist: artist,
            songs: songsArray,
            avatar : files.avatar[0].buffer
        };
        const result = await AlbumService.create(userId, albumRequest);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}

const getAlbum = async (req: Request, res: Response, next: NextFunction) => {
    try{
            const result = await AlbumService.getAlbum();
            res.status(StatusCodes.OK).json(result)
        }catch(e){
            next(e);
        }
}
const getAlbumForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try{
            const result = await AlbumService.getAlbumForAdmin();
            res.status(StatusCodes.OK).json(result)
        }catch(e){
            next(e);
        }
}


const updateAlbum = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.jwtDecoded.userInfo.userId;
        const {album_id} = req.params
        const {album_name, decription, release_day,artist } = req.body;
        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };
        const albumUpdateRequest : AlbumUpdateRequest = {
            album_name: album_name,
            decription: decription,
            release_day: release_day,
            artist: artist,
            avatar : files?.avatar?.[0]?.buffer
        };
        const result = await AlbumService.updateAlbum( albumUpdateRequest,album_id, userId);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}

const deletedAlbum = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.jwtDecoded.userInfo.userId;
        const {album_id} = req.params
        const result = await AlbumService.deletedAlbum(album_id, userId);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}

const addSongToAlbum = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.jwtDecoded.userInfo.userId;
        const {song_id, album_id} = req.body
        const result = await AlbumService.addSongToAlbum(song_id,album_id, userId);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}
const getAllAlbum = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await AlbumService.getAllAlbumservice();
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}
const getAlbumById = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {albumId} = req.params;
        console.log(albumId);
        const result = await AlbumService.getAlbumByIdService(albumId);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}

export const AlbumController = {
    create,
    getAlbum,
    updateAlbum,
    deletedAlbum,
    addSongToAlbum,
    getAlbumById,
    getAllAlbum,
    getAlbumForAdmin
}