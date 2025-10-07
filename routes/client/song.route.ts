import { Router } from "express";
import { SongController } from "../../controllers/songController";
import Song from "../../models/Song.model";
import { songValidators } from "../../validators/song.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";




const router: Router = Router();

router.get("/search", songValidators.searchSongValidator, AuthMiddleware.validateRequest, SongController.searchSong)

router.get("/rankings", SongController.getPaginatedSongsController)

router.get("/:songid",songValidators.getSongValidator, AuthMiddleware.validateRequest, SongController.getSongs)

router.get("/artist/:artist_id",songValidators.getSongsByArtistValidator, AuthMiddleware.validateRequest, SongController.getSongsByArtist)

router.post("/:songid/favorite", songValidators.toggleFavoriteValidator,AuthMiddleware.validateRequest, SongController.toggleFavorite)

router.post("/:songid/playList", songValidators.addSongIntoPlayListValidator,AuthMiddleware.validateRequest, SongController.addSongIntoPlayList)

router.post("/:songid/createPlaylist", songValidators.createPlayListValidator,AuthMiddleware.validateRequest, SongController.createPlayList)
router.post("/:songid/addHistory", songValidators.addHistorySongValidator, AuthMiddleware.validateRequest, SongController.addHistorySong)

export const songRoutes: Router = router;