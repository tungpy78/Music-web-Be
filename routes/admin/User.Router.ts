import { Router } from "express";
import { UserController } from "../../controllers/userController";
import { AuthController } from "../../controllers/AuthController";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { authValidators } from "../../validators/auth.validator";


const router: Router = Router();

router.post('/create',AuthController.createAccount);

router.patch('/setrole',AuthMiddleware.isAdmin, AuthController.setRole);

router.get('/getrole',AuthController.getRole);

router.patch('/setDelete/:account_id',AuthMiddleware.isAdmin, AuthController.setDelete)

router.patch('/setpassdefault/:account_id',AuthMiddleware.isAdmin,AuthController.setPassDefault);

router.patch('/setpass',AuthMiddleware.isAuthorized,AuthController.setpassword)

router.get('/getaccount',AuthMiddleware.isAdmin,AuthController.getAccount);
export const UserRouter: Router = router;