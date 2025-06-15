"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteRouter = void 0;
const express_1 = require("express");
const favoriteController_1 = require("../../controllers/favoriteController");
const router = (0, express_1.Router)();
router.get('/', favoriteController_1.favoriteController.getFavorite);
exports.favoriteRouter = router;
