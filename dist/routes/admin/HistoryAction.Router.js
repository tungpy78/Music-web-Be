"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryActionRouter = void 0;
const express_1 = require("express");
const historyActionControler_1 = require("../../controllers/historyActionControler");
const router = (0, express_1.Router)();
router.get('/', historyActionControler_1.HistotyActionController.getHistoryAction);
exports.HistoryActionRouter = router;
