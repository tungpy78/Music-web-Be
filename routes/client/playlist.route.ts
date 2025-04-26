import { Router } from "express";
import { PlayListController } from "../../controllers/playListController";




const router: Router = Router();



router.get('/', PlayListController.getPlayList);
router.post('/:playlistId', PlayListController.getPlayListById)
router.delete(`/:playlistId/song/:songId`, PlayListController.removeSongPlayList)
router.delete(`/:playlistId/delete`,PlayListController.deletePlayList)

export const playlistRoutes: Router = router;