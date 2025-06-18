import { Router } from "express";
import { TopicController } from "../../controllers/TopicController";
import { topicValidators } from "../../validators/topic.validator";



const router: Router = Router();



router.get('/', TopicController.getTopics);
router.get('/:topicId',topicValidators.getTopicById ,TopicController.getTopicById);


export const topicRoutes: Router = router;