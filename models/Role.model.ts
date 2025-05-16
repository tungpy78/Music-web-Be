import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  role_name: { type: String, required: true, unique: true },
}, {
  timestamps: true // Tự tạo createdAt, updatedAt
});

export default mongoose.model("Role", RoleSchema, "Role");