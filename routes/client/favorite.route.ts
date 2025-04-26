import { Router } from "express";
import { favoriteController } from "../../controllers/favoriteController";





const router: Router = Router();



router.get('/', favoriteController.getFavorite);


export const favoriteRouter: Router = router;