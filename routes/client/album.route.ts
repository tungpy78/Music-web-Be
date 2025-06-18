import { Router } from "express";
import { AlbumController } from "../../controllers/AlbumController";
import { AlbumValidators } from "../../validators/album.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";





const router: Router = Router();

router.get('/', AlbumController.getAllAlbum);
router.get('/:albumId',AlbumValidators.getAlbumByIdValidator,AuthMiddleware.validateRequest, AlbumController.getAlbumById);

export const AlbumRouter: Router = router;