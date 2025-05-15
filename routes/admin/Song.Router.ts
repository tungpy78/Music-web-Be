import { Router } from "express";
import { SongController } from "../../controllers/songController";




const router: Router = Router();


router.post("/add", SongController.addNewSong);


export const SongRoutes: Router = router;