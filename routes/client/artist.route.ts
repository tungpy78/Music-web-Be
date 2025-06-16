import { Router } from "express";
import { ArtistController } from "../../controllers/ArtistController";






const router: Router = Router();

router.get('/:artistId', ArtistController.getArtistById);

export const ArtistRouter: Router = router;