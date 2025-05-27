"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistRouter = void 0;
const express_1 = require("express");
const ArtistController_1 = require("../../controllers/ArtistController");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const router = (0, express_1.Router)();
router.post('/creat', upload_1.default.fields([{ name: 'fileAvata', maxCount: 1 }]), ArtistController_1.ArtistController.create);
router.get('/getAll', ArtistController_1.ArtistController.getAllArtist);
router.patch('/update/:artist_id', upload_1.default.fields([{ name: 'fileAvata', maxCount: 1 }]), ArtistController_1.ArtistController.updateArtist);
exports.ArtistRouter = router;
