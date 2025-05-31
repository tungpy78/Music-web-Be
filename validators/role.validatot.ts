import {  param } from "express-validator";
const addRoleValidator = [
    param("name")
    .notEmpty().withMessage("Song ID không được để trống")
]
export const RoleValidator = {
    addRoleValidator
}