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
    deletedAt: Date,
    account_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        unique: true,
        required: true,
    }
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema, "User");
export default User;
