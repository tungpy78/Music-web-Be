import { Router } from "express";
import {RoleController} from "../../controllers/RoleController"
import { RoleValidator } from "../../validators/role.validatot";
import { AuthMiddleware } from "../../middlewares/authMiddleware";

const router: Router = Router();

router.post('/create/:name',RoleValidator.addRoleValidator,AuthMiddleware.validateRequest,RoleController.create)

export const RoleRouter: Router =  router;