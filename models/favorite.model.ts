import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    addedAt: { type: Date, default: Date.now }
  });
  
  FavoriteSchema.index({ userId: 1, songId: 1 }, { unique: true });
  
const Favorite = mongoose.model('Favorite', FavoriteSchema,"Favorite");
export default Favorite;
  