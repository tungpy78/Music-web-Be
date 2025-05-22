import { Router } from "express";
import { UserController } from "../../controllers/userController";
import { AuthController } from "../../controllers/AuthController";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { authValidators } from "../../validators/auth.validator";


const router: Router = Router();



router.post('/login', authValidators.loginValidator, AuthMiddleware.validateRequest, UserController.login);

router.post('/register', authValidators.registerValidator, AuthMiddleware.validateRequest, UserController.register);

router.post('/change-password', AuthMiddleware.isAuthorized, authValidators.changePasswordValidator, AuthMiddleware.validateRequest, UserController.changePassword);

router.post('/change-profile', AuthMiddleware.isAuthorized, authValidators.changeProfileValidator, AuthMiddleware.validateRequest, UserController.changeProfile);

router.post('/send-otp', authValidators.sendOtpValidator, AuthMiddleware.validateRequest, UserController.sendOtp);

router.post('/verify-otp', authValidators.verifyOtpValidator, AuthMiddleware.validateRequest, UserController.verifyOtp);

router.post('/reset-password', authValidators.resetPasswordValidator, AuthMiddleware.validateRequest, UserController.resetPassword);

router.put('/refresh-token', UserController.refreshToken);

router.post('/create',AuthController.createAccount);

router.patch('/setrole',AuthMiddleware.isAdmin, AuthController.setRole);

router.get('/getrole',AuthController.getRole);

export const userRouter: Router = router;