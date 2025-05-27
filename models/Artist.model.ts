import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    bio: String,
    imageUrl: String
    },
    {   timestamps: true }
);
  
const Artist = mongoose.model('Artist', ArtistSchema, 'Artist');
export default Artist;
  