"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRouter = void 0;
const express_1 = require("express");
const AlbumController_1 = require("../../controllers/AlbumController");
const album_validator_1 = require("../../validators/album.validator");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/albumForAdmin', AlbumController_1.AlbumController.getAlbumForAdmin);
router.post('/create', upload_1.default.fields([{ name: 'avatar', maxCount: 1 }]), album_validator_1.AlbumValidators.createAlbumValidator, authMiddleware_1.AuthMiddleware.validateRequest, AlbumController_1.AlbumController.create);
router.patch('/update/:album_id', upload_1.default.fields([{ name: 'avatar', maxCount: 1 }]), album_validator_1.AlbumValidators.updateAlbum, authMiddleware_1.AuthMiddleware.validateRequest, AlbumController_1.AlbumController.updateAlbum);
router.delete('delete/:album_id', album_validator_1.AlbumValidators.deletedAlbum, authMiddleware_1.AuthMiddleware.validateRequest, AlbumController_1.AlbumController.deletedAlbum);
router.patch('/addsongtoalbum', album_validator_1.AlbumValidators.addSongToAlbum, authMiddleware_1.AuthMiddleware.validateRequest, AlbumController_1.AlbumController.addSongToAlbum);
exports.AlbumRouter = router;
