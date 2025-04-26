import { Router } from "express";
import { HistotyController } from "../../controllers/histotyController";



const router: Router = Router();



router.get('/',HistotyController.getHistory);


export const histotyRoute: Router = router;