import {Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PlayListService } from "../services/playListService";

const getPlayList = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const userId = req.jwtDecoded.userInfo.userId

        const result = await PlayListService.getPlayListService(userId)
        
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error) 
    }
}
const getPlayListById = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const {playlistId} = req.params
        const userId = req.jwtDecoded.userInfo.userId
        const result = await PlayListService.getPlayListByIdService(playlistId, userId)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}
const removeSongPlayList = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {songId,playlistId} = req.params
        const userId = req.jwtDecoded.userInfo.userId


        const result = await PlayListService.removeSongPlayListService(songId,playlistId,userId)
        res.status(StatusCodes.OK).json(result)

    } catch (error) {
        next(error)
    }
}
const deletePlayList = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {playlistId} = req.params
        const userId = req.jwtDecoded.userInfo.userId
        const response = await PlayListService.deletePlayListService(playlistId,userId)
        res.status(StatusCodes.OK).json(response)
    } catch (error) {
        next(error)
    }
}

export const PlayListController = {
    getPlayList,
    getPlayListById,
    removeSongPlayList,
    deletePlayList
}