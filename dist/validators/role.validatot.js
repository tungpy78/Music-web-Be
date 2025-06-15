"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleValidator = void 0;
const express_validator_1 = require("express-validator");
const addRoleValidator = [
    (0, express_validator_1.param)("name")
        .notEmpty().withMessage("Song ID không được để trống")
];
exports.RoleValidator = {
    addRoleValidator
};
