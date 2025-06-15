import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
    {
        password: {type: String, required: true},
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^0\d{9,10}$/, 'Số điện thoại không hợp lệ']
        },
        role_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true, default: new mongoose.Types.ObjectId("681b1c1327419f6f6416e116")}, // Default role_id, change as needed
        deleted: {type: Boolean, default: false},   
        active: {type: String, enum: ['active', 'inactive'], default: "active"}, // Default status, can be 'active' or 'inactive'
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model('Account', AccountSchema, "Account");
export default Account