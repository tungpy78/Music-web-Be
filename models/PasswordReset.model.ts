import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, {
  timestamps: true,
});

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema, "PasswordReset");
export default PasswordReset;
