import { Router } from "express";
import { UserController } from "../../controllers/userController";


const router: Router = Router();



router.post('/login',UserController.login);

router.put('/refresh-token', UserController.refreshToken);


export const userRouter: Router = router;