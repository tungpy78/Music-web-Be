import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema(
    {
        album_name: {type: String, required: true, unique: true},
        avatar: String,
        artist:     { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
        release_day: {type: Date, required: true},
        decription: {type: String},
        songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Songs'}]
    },
    {
        timestamps: true
    }
);

const Album = mongoose.model("Album", AlbumSchema, "Album");
export default Album;