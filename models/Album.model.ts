import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema(
    {
        album_name: {type: String, required: true, unique: true},
        release_day: {type: Date, required: true},
        decription: {type: String}
    },
    {
        timestamps: true
    }
);

const Album = mongoose.model("Album", AlbumSchema, "ALBUM");
export default Album;