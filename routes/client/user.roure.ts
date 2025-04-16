import { Router } from "express";
import { UserController } from "../../controllers/userController";

const router: Router = Router();



router.post('/login', UserController.login);


export const userRouter: Router = router;