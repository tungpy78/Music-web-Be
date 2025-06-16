import RoleModel from "../models/Role.model";
import ApiError from "../Utils/AppError"
import { StatusCodes } from "http-status-codes"

const create = async(name:string) =>{
    try{
        const role = new RoleModel();
        role.role_name = name
        await role.save();
        return "thêm thành công"

    }catch(e){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Lỗi khi thêm role: "+ e)
    }
}

export const RoleService = {
    create
}