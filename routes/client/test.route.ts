import { Router } from "express";
import { testController } from "../../controllers/testController";




const router: Router = Router();



router.get('/:songid',testController.testSessionRecsController);


export const testRouter: Router = router;