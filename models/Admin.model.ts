import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
            manager_name: {type: String, required: true},
            email: {type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']},
            gender: {type: String, enum:["Nam", "Nữ", "Khác"], required: true},
            birthday: {type: Date, required: true},
            account: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true}
        },
    {
        timestamps: true
    }
);

const Admin = mongoose.model("Admin", AdminSchema, "ADMIN");
export default Admin;