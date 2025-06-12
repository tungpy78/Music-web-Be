import { Router } from "express";
import { ArtistController } from "../../controllers/ArtistController";
import upload from "../../middlewares/upload";
import { ArtistValidator } from "../../validators/artist.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";

const router: Router = Router();

router.post('/creat', upload.fields([{ name: 'fileAvata', maxCount: 1 }]),ArtistValidator.createArtist,AuthMiddleware.validateRequest,ArtistController.create)
router.get('/getAll',ArtistController.getAllArtist)
router.patch('/update/:artist_id',upload.fields([{ name: 'fileAvata', maxCount: 1 }]),ArtistValidator.updateArtist,AuthMiddleware.validateRequest ,ArtistController.updateArtist)
export const ArtistRouter: Router = router;