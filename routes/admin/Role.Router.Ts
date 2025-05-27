import { Router } from "express";
import {RoleController} from "../../controllers/RoleController"

const router: Router = Router();

router.post('/create/:name',RoleController.create)

export const RoleRouter: Router =  router;