"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRouter = void 0;
const express_1 = require("express");
const RoleController_1 = require("../../controllers/RoleController");
const router = (0, express_1.Router)();
router.post('/create/:name', RoleController_1.RoleController.create);
exports.RoleRouter = router;
