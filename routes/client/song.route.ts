import { Router } from "express";
import { SongController } from "../../controllers/songController";
import Song from "../../models/Song.model";
import { songValidators } from "../../validators/song.validator";




const router: Router = Router();

router.get("/search", songValidators.searchSongValidator, SongController.searchSong)

router.get("/:songid",songValidators.getSongValidator, SongController.getSongs)  

router.post("/:songid/favorite", songValidators.toggleFavoriteValidator, SongController.toggleFavorite)

router.post("/:songid/playList", songValidators.addSongIntoPlayListValidator, SongController.addSongIntoPlayList)

router.post("/:songid/createPlaylist", songValidators.createPlayListValidator, SongController.createPlayList)
router.post("/:songid/addHistory", songValidators.addHistorySongValidator, SongController.addHistorySong)

export const songRoutes: Router = router;