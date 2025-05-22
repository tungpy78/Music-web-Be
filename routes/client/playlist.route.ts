import { Router } from "express";
import { PlayListController } from "../../controllers/playListController";
import { playListValidators } from "../../validators/playlist.validator";




const router: Router = Router();



router.get('/', PlayListController.getPlayList);
router.post('/:playlistId', playListValidators.getPlayListById, PlayListController.getPlayListById)
router.delete(`/:playlistId/song/:songId`,playListValidators.removeSongPlayList ,PlayListController.removeSongPlayList)
router.delete(`/:playlistId/delete`,playListValidators.deletePlayList ,PlayListController.deletePlayList)

export const playlistRoutes: Router = router;