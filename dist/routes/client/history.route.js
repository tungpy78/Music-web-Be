"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.histotyRoute = void 0;
const express_1 = require("express");
const histotyController_1 = require("../../controllers/histotyController");
const router = (0, express_1.Router)();
router.get('/', histotyController_1.HistotyController.getHistory);
exports.histotyRoute = router;
