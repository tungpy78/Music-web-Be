import { StatusCodes } from "http-status-codes"
import { AuthRequest } from "../Request/AuthRequest"
import Account from "../models/Account.model";
import mongoose, { mongo } from "mongoose";
import User from "../models/User.model";
import RoleModel from "../models/Role.model";
import bcrypt from "bcrypt";

const  createAccount = async(authRequest : AuthRequest) => {
    try{
        const account = new Account();
        Object.assign(account,authRequest);
        const hashedPassword =await bcrypt.hash(authRequest.password, 10);
        account.password = hashedPassword
        account.role_id = new mongoose.Types.ObjectId("681b1c1327419f6f6416e116");
        await account.save();
        const user = new User();
        user.fullname = authRequest.fullname;
        user.email = authRequest.email;
        user.account_id = account.id;
        try {
            await user.save();
            return "Tạo thành công";
        } catch (userError) {
            await Account.deleteOne({ _id: account._id });
            throw new Error("Lỗi khi tạo user, đã rollback account: " + userError);
        }
    }catch(e){
        throw new Error("Lỗi khi tạo account: "+ e);
    }
}

const setRole = async(account_id: string, role: string) => {
    try{
        const account = await Account.findById(account_id);
         if (!account) {
            throw new Error("Không tìm thấy account với ID đã cho.");
        }
        account.role_id = new mongoose.Types.ObjectId(role);

        await account.save();

        return "Cập nhật quyền thành công";
    }catch(e){
        throw new Error("Lỗi khi thay đổi quyền: "+e);
    }
}

const getRole = async() => {
    try {
        const roles = await RoleModel.find({});
        return roles;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Role:", error);
        throw error;
    }
}
export const AuthService ={
    createAccount,
    setRole,
    getRole
}