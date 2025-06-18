import { Router } from "express";
import { ArtistController } from "../../controllers/ArtistController";
import { ArtistValidator } from "../../validators/artist.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";






const router: Router = Router();

router.get('/:artistId',ArtistValidator.getArtistByIdValidator,AuthMiddleware.validateRequest, ArtistController.getArtistById);

export const ArtistRouter: Router = router;