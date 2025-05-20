import RoleModel from "../models/Role.model";

const create = async(name:string) =>{
    try{
        const role = new RoleModel();
        role.role_name = name
        await role.save();
        return "thêm thành công"

    }catch(e){
        throw new Error("Lỗi khi thêm role: "+ e)
    }
}

export const RoleService = {
    create
}