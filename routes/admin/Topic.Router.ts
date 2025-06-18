import { Router } from "express";
import upload from "../../middlewares/upload";
import { TopicController } from "../../controllers/TopicController";
import { topicValidators } from "../../validators/topic.validator";
import { AuthMiddleware } from "../../middlewares/authMiddleware";

const router: Router = Router();

router.get('/adminTopics', TopicController.getTopicsForAdmin);
router.post('/create',upload.fields([{ name: 'fileAvata', maxCount: 1 }]),topicValidators.createTopic,AuthMiddleware.validateRequest,TopicController.create)
router.patch('/update/:topicId',upload.fields([{ name: 'fileAvata', maxCount: 1 }]),topicValidators.updateTopic,AuthMiddleware.validateRequest,TopicController.updateTopic)
router.patch('/delete/:topicId',topicValidators.deletedtopic,AuthMiddleware.validateRequest,TopicController.deletedtopic);
router.patch('/restore/:topicId',topicValidators.deletedtopic,AuthMiddleware.validateRequest,TopicController.restoretopic);
export const TopicRouter: Router =  router;