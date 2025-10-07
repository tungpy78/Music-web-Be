import { Router } from "express";
import { RecommendationController } from "../../controllers/recommendationController";




const router: Router = Router();



router.get('/homepage',RecommendationController.getUserRecommendations);
router.post('/related',RecommendationController.recommendation);


export const recommendationRouter: Router = router;