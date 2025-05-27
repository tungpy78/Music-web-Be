import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/RoleService";
import { ok } from "assert";
import { StatusCodes } from "http-status-codes";

const create = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const {name} = req.params
        const result = await RoleService.create(name);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e)
    }
}

export const RoleController = {
    create
}