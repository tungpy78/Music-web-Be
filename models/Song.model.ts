import mongoose from "mongoose";
import "./Artist.model";

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
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
  
const Song = mongoose.model('Song', SongSchema,"Songs");
export default Song;
  