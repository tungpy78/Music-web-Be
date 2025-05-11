import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
  },
  {
    timestamps: true
  }
);
  
 const Playlist = mongoose.model('Playlist', PlaylistSchema,"PLAYLIST");
 export default Playlist
  