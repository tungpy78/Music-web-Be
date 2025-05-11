import { Router } from "express";
import { SongController } from "../../controllers/songController";
import Song from "../../models/Song.model";




const router: Router = Router();


router.get("/:songid", SongController.getSongs)  

router.post("/:songid/favorite", SongController.toggleFavorite)

router.post("/:songid/playList", SongController.addSongIntoPlayList)

router.post("/:songid/createPlaylist",SongController.createPlayList)
router.post("/:songid/addHistory",SongController.addHistorySong)



export const songRoutes: Router = router;