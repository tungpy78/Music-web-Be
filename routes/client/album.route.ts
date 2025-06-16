import { Router } from "express";
import { AlbumController } from "../../controllers/AlbumController";





const router: Router = Router();

router.get('/', AlbumController.getAllAlbum);
router.get('/:albumId', AlbumController.getAlbumById);

export const AlbumRouter: Router = router;