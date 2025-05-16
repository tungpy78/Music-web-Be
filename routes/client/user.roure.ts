import { Router } from "express";
import { UserController } from "../../controllers/userController";
import { AuthController } from "../../controllers/AuthController";
import { AuthMiddleware } from "../../middlewares/authMiddleware";

const router: Router = Router();



router.post('/login',UserController.login);

router.put('/refresh-token', UserController.refreshToken);

router.post('/create',AuthController.createAccount);

router.patch('/setrole',AuthMiddleware.isAdmin, AuthController.setRole);

router.get('/getrole',AuthController.getRole);

export const userRouter: Router = router;