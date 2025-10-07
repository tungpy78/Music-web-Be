import mongoose from "mongoose";
import { removeVietnameseTones } from "../Utils/removeVietnameseTones";

const ArtistSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    search_name: { type: String }, // Trường mới cho tìm kiếm
    bio: String,
    imageUrl: String
    },
    {   timestamps: true }
);
ArtistSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.search_name = removeVietnameseTones(this.name).toLowerCase();
    }
    next();
});
  
const Artist = mongoose.model('Artist', ArtistSchema, 'Artist');
export default Artist;
  