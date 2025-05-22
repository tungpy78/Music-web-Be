import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    songs: [
      {
        songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
      }
    ],
  
    createdAt: { type: Date, default: Date.now }
  });
  
 const Playlist = mongoose.model('Playlist', PlaylistSchema,"Playlist");
 export default Playlist
  