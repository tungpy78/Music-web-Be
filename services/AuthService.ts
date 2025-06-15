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

const setDelete = async(account_id : string ) => {
    try{
        const account = await Account.findById(account_id);
        if (!account) {
            throw new Error("Không tìm thấy account với ID đã cho.");
        }
        account.deleted = !account.deleted;
        await account?.save()
        return "Cập nhập thành công"
    }catch(e){
        throw new Error("Lỗi khi xét quyền: "+e);
    }
}

const setpassword = async(account_id: string, pass: string, newpass: string) => {
    try{
        const account = await Account.findById(account_id);  
        if (!account) {
            throw new Error("Không tìm thấy account với ID đã cho.");
        }
        const isValid = await bcrypt.compare(pass, account.password);
        if (!isValid) {
            throw new Error("Sai mật khẩu không khớp ");
        }
        account.password = await bcrypt.hash(newpass, 10);
        await account.save()
        return "Cập nhập thành công" 
    }catch(e){
        throw new Error("Lỗi khi thay đổi mk: "+e);
    }
}

const setPassDefault = async ( account_id: string) => {
    try{
        const account = await Account.findById(account_id);
        if (!account) {
            throw new Error("Không tìm thấy account với ID đã cho.");
        }
        account.password = await bcrypt.hash("123456", 10);
        await account.save();
        return "Cập nhập thành công"
    }catch(e){
        throw new Error("Lỗi khi set pass default"+ e);
    }
}

const getAccount = async () => {
  const accounts = await Account.find({role_id: new mongoose.Types.ObjectId("681b1c1327419f6f6416e117")}, 'phone password role_id');
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found.");
  }

  const result = [];

  for (const account of accounts) {
    const user = await User.findOne({ account_id: account._id }, 'fullname email status deleted');
    const role = await RoleModel.findOne({ _id: account.role_id }, 'role_name');

    result.push({
        id: account.id,
        phone: account.phone,
        password: account.password,
        role_name: role?.role_name || null,
        fullname: user?.fullname || null,
        email: user?.email || null,
        status: account?.status || null,
        deleted: account?.deleted || null
    });
  }

  return result;
};
export const AuthService ={
    createAccount,
    setRole,
    getRole,
    setDelete,
    setpassword,
    setPassDefault,
    getAccount
}