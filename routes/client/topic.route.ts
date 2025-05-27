import { Router } from "express";
import { TopicController } from "../../controllers/TopicController";



const router: Router = Router();



router.get('/', TopicController.getTopics);
router.get('/:topicId', TopicController.getTopicById);


export const topicRoutes: Router = router;