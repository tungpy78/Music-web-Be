"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongRoutes = void 0;
const express_1 = require("express");
const songController_1 = require("../../controllers/songController");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const router = (0, express_1.Router)();
router.post("/create", upload_1.default.fields([
    { name: 'fileavatar', maxCount: 1 },
    { name: 'fileaudio', maxCount: 1 }
]), songController_1.SongController.addNewSong);
router.patch('/update/:song_id', upload_1.default.fields([
    { name: 'fileavatar', maxCount: 1 },
    { name: 'fileaudio', maxCount: 1 }
]), songController_1.SongController.updateSong);
router.patch('/delete/:song_id', songController_1.SongController.deletedSong);
router.patch('/restore/:song_id', songController_1.SongController.restoreSong);
exports.SongRoutes = router;
