import { Router } from "express";
import { SongController } from "../../controllers/songController";
import upload from "../../middlewares/upload";




const router: Router = Router();


router.post("/add", upload.fields([
    { name: 'fileavatar', maxCount: 1 },
    { name: 'fileaudio', maxCount: 1 }
  ]), SongController.addNewSong);

  router.patch('/update/:song_id', upload.fields([
    { name: 'fileavatar', maxCount: 1 },
    { name: 'fileaudio', maxCount: 1 }
  ]), SongController.updateSong);

  router.patch('/delete/:song_id',SongController.deletedSong);

router.patch('/restore/:song_id',SongController.restoreSong);
export const SongRoutes: Router = router;