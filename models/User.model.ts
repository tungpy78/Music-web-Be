import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
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
    account_id: {
        type:mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    }
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema, "User");
export default User;
