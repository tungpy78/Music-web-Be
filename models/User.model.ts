import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^0\d{9,10}$/, 'Số điện thoại không hợp lệ']
    },
    fullname:{
        type:String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema, "user");
export default User;
