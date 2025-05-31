import { Router } from "express";
import upload from "../../middlewares/upload";
import { TopicController } from "../../controllers/TopicController";
import { topicValidators } from "../../validators/topic.validator";

const router: Router = Router();

router.post('/create',topicValidators.createTopic,upload.fields([{ name: 'fileAvata', maxCount: 1 }]),TopicController.create)
router.patch('/update/:topicId',upload.fields([{ name: 'fileAvata', maxCount: 1 }]) ,TopicController.updateTopic)
router.patch('/delete/:topicId',TopicController.deletedtopic);
router.patch('/restore/:topicId',TopicController.restoretopic);
export const TopicRouter: Router =  router;