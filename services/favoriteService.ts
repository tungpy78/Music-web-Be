import Favorite from "../models/Favorite.model"

const getFavoriteService = async (userId:string) => {
    const favorite = await Favorite.find(
        {
            userId
        }
    ).populate('songId')

    const songs = favorite.map(item => item.songId);
     
    return songs
}
export const favoriteService = {
    getFavoriteService
}