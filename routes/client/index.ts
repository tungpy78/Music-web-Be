import { Express } from "express"
import { topicRoutes } from "./topic.route"
import { userRouter } from "./user.roure";

const clientRoutes = (app: Express): void => {

    app.use(`/topic`, topicRoutes);
    app.use(`/auth`, userRouter);

};

export default clientRoutes;