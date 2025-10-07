import mongoose from "mongoose";
import "./Artist.model";
import { removeVietnameseTones } from "../Utils/removeVietnameseTones";


const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    search_title: { type: String }, // Trường mới cho tìm kiếm
    artist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }],
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    avatar: { type: String, required: true },
    audio: String,
    like: { type: Number, default: 0 },
    description: String,
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    slug: { type: String, required: true },
    lyrics: String,
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },

  },{timestamps: true});
  SongSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.search_title = removeVietnameseTones(this.title).toLowerCase();
    }
    next();
});

  
const Song = mongoose.model('Song', SongSchema,"Songs");
export default Song;
  