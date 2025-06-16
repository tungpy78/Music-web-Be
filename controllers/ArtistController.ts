import { Request, Response, NextFunction } from "express";
import { AritistRequest } from "../Request/ArtistRequest";
import { ArtistService } from "../services/ArtistService";
import { StatusCodes } from "http-status-codes";

const create = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {name,bio } = req.body
        const userId = req.jwtDecoded.userInfo.userId;
         const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
        };
        if(!name || !files){
            res.status(400).json({message: 'Thiếu trường bắt buộc: name, avatar',});
          return;
        }
        const artistRequest : AritistRequest = {
            name: name,
            bio: bio,
            fileAvata: files.fileAvata[0].buffer
        }
        const result = await ArtistService.create(userId,artistRequest)
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e)
    }
}

const getAllArtist = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await ArtistService.getAllArtist()
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e);
    }
}

const updateArtist = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {name, bio } = req.body
        const {artist_id} = req.params
        const userId = req.jwtDecoded.userInfo.userId;
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        if(!name){
            res.status(400).json({message: 'Thiếu trường bắt buộc: name',});
          return;
        }
        const artistRequest : AritistRequest = {
            name: name,
            bio: bio,
            fileAvata: files?.fileAvata?.[0]?.buffer ?? null
        }
        const result = await ArtistService.updateArtist(userId,artistRequest,artist_id)
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e)
    }
}
const getArtistById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {artistId} = req.params
        const result = await ArtistService.getArtistByIdService(artistId)
        res.status(StatusCodes.OK).json(result)
    }catch(e){
        next(e)
    }
}

export const ArtistController = {
    create,
    getAllArtist,
    updateArtist,
    getArtistById
}