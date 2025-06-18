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

const setDelete = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {account_id} = req.params;
        const result = await AuthService.setDelete(account_id);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}

const setpassword = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const userData = req.jwtDecoded;
        const account_id = userData?.userInfo?.userId;
        const {pass,newpass} = req.body
        const result = await AuthService.setpassword(account_id,pass,newpass);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}

const setPassDefault = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {account_id} = req.params;
        const result = await AuthService.setPassDefault(account_id);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}

const getAccount = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await AuthService.getAccount();
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}

const setStatus = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {account_id} = req.params;
        const result = await AuthService.setStatus(account_id);
        res.status(StatusCodes.OK).json(result);
    }catch(e){
        next(e);
    }
}
const getAllAccount = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.getAllAccountService();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}
export const AuthController = {
    createAccount,
    setRole,
    getRole,
    setDelete,
    setpassword,
    setPassDefault,
    getAccount,
    setStatus,
    getAllAccount
}