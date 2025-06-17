import { Router } from "express";
import { HistotyActionController } from "../../controllers/historyActionControler";


const router: Router = Router();

router.get('/',HistotyActionController.getHistoryAction)

export const HistoryActionRouter: Router = router;