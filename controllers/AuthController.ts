import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../Request/AuthRequest";
import { AuthService } from "../services/AuthService";


const createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const authRequest = req.body as AuthRequest;
        const result = await AuthService.createAccount(authRequest);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}

const setRole = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { account_id, role } = req.body;
        if (!account_id || !role) {
            res.status(400).json({ message: "Thiếu account_id hoặc role" });
        }
        const result = await AuthService.setRole(account_id, role);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}

const getRole = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await AuthService.getRole();
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}
export const AuthController = {
    createAccount,
    setRole,
    getRole
}