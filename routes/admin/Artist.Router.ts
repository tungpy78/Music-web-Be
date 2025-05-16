import { Router } from "express";
import { ArtistController } from "../../controllers/ArtistController";
import upload from "../../middlewares/upload";

const router: Router = Router();

router.post('/creat', upload.fields([{ name: 'fileAvata', maxCount: 1 }]),ArtistController.create)
router.get('/getAll',ArtistController.getAllArtist)
router.patch('/update/:artist_id',upload.fields([{ name: 'fileAvata', maxCount: 1 }]) ,ArtistController.updateArtist)
export const ArtistRouter: Router = router;