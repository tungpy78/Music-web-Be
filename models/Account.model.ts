import mongoose from "mongoose";
import { ref } from "process";

const AccountSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
        deleted: {type: Boolean,default: false}
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model('Account', AccountSchema, "ACCOUNT");
export default Account