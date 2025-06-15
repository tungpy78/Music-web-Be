import { Router } from "express";
import { SongController } from "../../controllers/songController";
import upload from "../../middlewares/upload";
import { songValidators } from "../../validators/song.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";




const router: Router = Router();


router.post("/create", upload.fields([
    { name: 'fileavatar', maxCount: 1 },
    { name: 'fileaudio', maxCount: 1 }
  ]),songValidators.createSong,AuthMiddleware.validateRequest, SongController.addNewSong);

router.patch('/update/:song_id', upload.fields([
    { name: 'fileavatar', maxCount: 1 },
    { name: 'fileaudio', maxCount: 1 }
  ]),songValidators.updateSong,AuthMiddleware.validateRequest, SongController.updateSong);

router.patch('/delete/:song_id',songValidators.deletedSong,AuthMiddleware.validateRequest,SongController.deletedSong);

router.patch('/restore/:song_id',songValidators.deletedSong,AuthMiddleware.validateRequest,SongController.restoreSong);
export const SongRoutes: Router = router;