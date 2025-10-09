"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const testController_1 = require("../../controllers/testController");
const router = (0, express_1.Router)();
router.get('/:songid', testController_1.testController.testSessionRecsController);
exports.testRouter = router;
