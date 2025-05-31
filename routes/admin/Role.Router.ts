import { Router } from "express";
import {RoleController} from "../../controllers/RoleController"
import { RoleValidator } from "../../validators/role.validatot";

const router: Router = Router();

router.post('/create/:name',RoleValidator.addRoleValidator,RoleController.create)

export const RoleRouter: Router =  router;