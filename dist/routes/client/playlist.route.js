"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistRoutes = void 0;
const express_1 = require("express");
const playListController_1 = require("../../controllers/playListController");
const playlist_validator_1 = require("../../validators/playlist.validator");
const router = (0, express_1.Router)();
router.get('/', playListController_1.PlayListController.getPlayList);
router.post('/:playlistId', playlist_validator_1.playListValidators.getPlayListById, playListController_1.PlayListController.getPlayListById);
router.delete(`/:playlistId/song/:songId`, playlist_validator_1.playListValidators.removeSongPlayList, playListController_1.PlayListController.removeSongPlayList);
router.delete(`/:playlistId/delete`, playlist_validator_1.playListValidators.deletePlayList, playListController_1.PlayListController.deletePlayList);
exports.playlistRoutes = router;
