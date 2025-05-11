import mongoose from "mongoose";

const PlaylistSongSchema = new mongoose.Schema(
    {
        playlist_id: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
        song_id: {type: mongoose.Schema.Types.ObjectId, required: true}
    },
    {
        timestamps: true
    }
);

export default mongoose.model("PlaylistSong", PlaylistSongSchema, "PLAYLIST_SONG");