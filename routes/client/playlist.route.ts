import { Router } from "express";
import { PlayListController } from "../../controllers/playListController";
import { playListValidators } from "../../validators/playlist.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";




const router: Router = Router();



router.get('/', PlayListController.getPlayList);
router.post('/:playlistId', playListValidators.getPlayListById,AuthMiddleware.validateRequest, PlayListController.getPlayListById)
router.delete(`/:playlistId/song/:songId`,playListValidators.removeSongPlayList, AuthMiddleware.validateRequest, PlayListController.removeSongPlayList)
router.delete(`/:playlistId/delete`,playListValidators.deletePlayList,AuthMiddleware.validateRequest, PlayListController.deletePlayList)

export const playlistRoutes: Router = router;