import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^0\d{9,10}$/, 'Số điện thoại không hợp lệ']
        },
        role_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
        deleted: {type: Boolean,default: false}
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model('Account', AccountSchema, "Account");
export default Account