import { Router } from "express";
import { AlbumController } from "../../controllers/AlbumController";
import { AlbumValidators } from "../../validators/album.validator";
import upload from "../../middlewares/upload";
import { AuthMiddleware } from "../../middlewares/authMiddleware";

const router: Router = Router();

router.post('/create',upload.fields([{ name: 'avatar', maxCount: 1 }]),AlbumValidators.createAlbumValidator,AuthMiddleware.validateRequest,AlbumController.create)
router.patch('/update/:album_id',upload.fields([{ name: 'avatar', maxCount: 1 }]),AlbumValidators.updateAlbum,AuthMiddleware.validateRequest,AlbumController.updateAlbum);
router.delete('delete/:album_id',AlbumValidators.deletedAlbum,AuthMiddleware.validateRequest,AlbumController.deletedAlbum);
router.patch('/addsongtoalbum',AlbumValidators.addSongToAlbum,AuthMiddleware.validateRequest,AlbumController.addSongToAlbum);
router.patch('/removesongfromalbum',AlbumValidators.addSongToAlbum, AuthMiddleware.validateRequest, AlbumController.removeSongFromAlbum);
export const AlbumRouter: Router =  router;