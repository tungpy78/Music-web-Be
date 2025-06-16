import { NextFunction, Request, Response } from "express";
import { SongService } from "../services/songService";
import { StatusCodes } from "http-status-codes";
import { SongRequest } from "../Request/SongRequest";

const getSongs = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        
        const response = await SongService.getSongService(songid,userId ?? "");

        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        next(error);
    }
}
const getAllSongs = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const response = await SongService.getAllSongsService(userId);
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        next(error);
    }
}
const getSongsByArtist = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { artist_id } = req.params;
        const response = await SongService.getSongsByArtistService(artist_id);
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        next(error);
    }
}
const searchSong = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { keyword } = req.query;


        const result = await SongService.searchSongService(keyword as string);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const toggleFavorite = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { songid } = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        
        const result = await SongService.toggleFavoriteService(songid, userId);
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const addSongIntoPlayList = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {songid} = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const playListId = req.body.playListId

        const result = await SongService.addSongIntoPlayListService(songid,userId,playListId)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error);
    }
}
const createPlayList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {songid} = req.params;
        const userId = req.jwtDecoded.userInfo.userId;
        const name = req.body.name

        const result = await SongService.createPlayListService(songid,userId,name)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}
const addHistorySong = async (req:Request, res: Response, next:NextFunction) => {
    try {
        const {songid} = req.params;
        
        const userId = req.jwtDecoded.userInfo.userId;

        const result = await SongService.addHistoryService(songid,userId)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const addNewSong = async (req:Request, res: Response, next:NextFunction) =>{
    try{
        const userData = req.jwtDecoded;
        const userId = userData?.userInfo?.userId;
        const { title, artist: rawArtist, genre, description, lyrics } = req.body;
        const songsArray = Array.isArray(rawArtist)
            ? rawArtist
            : rawArtist
            ? [rawArtist]
            : [];
        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };

        const songRequest: SongRequest = {
        title,
        artist: songsArray,
        genre,
        fileavatar: files.fileavatar[0].buffer,
        description,
        lyrics,
        fileaudio: files.fileaudio[0].buffer,
        };
        const result = await SongService.addNewSong(userId,songRequest)
         res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e)
    }
}

const updateSong = async (req:Request, res: Response, next:NextFunction) =>{
    try{
        const userData = req.jwtDecoded;
        const userId = userData?.userInfo?.userId;
        const { title, artist, genre, description, lyrics} = req.body;
        const {song_id} = req.params;
        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };
        const songRequest: SongRequest = {
        title,
        artist,
        genre,
        fileavatar: files?.fileavatar?.[0]?.buffer ?? null,
        description,
        lyrics,
        fileaudio: files?.fileaudio?.[0]?.buffer ?? null,
        };
        const result = await SongService.updateSong(userId,songRequest,song_id)
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e)
    }
}

const deletedSong = async (req:Request, res: Response, next:NextFunction) => {
    try{
        const userData = req.jwtDecoded;
        const userId = userData?.userInfo?.userId;
        const {song_id} = req.params;
        const result = await SongService.deletedsong(userId,song_id);
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}
const restoreSong = async (req:Request, res: Response, next:NextFunction) => {
    try{
        const {song_id} = req.params;
        const result = await SongService.restoresong(song_id);
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}

export const SongController = {
    getSongs,
    getAllSongs,
    getSongsByArtist,
    toggleFavorite,
    addSongIntoPlayList,
    createPlayList,
    addHistorySong,
    addNewSong,
    updateSong,
    deletedSong,
    restoreSong,
    searchSong
}