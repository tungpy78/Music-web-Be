import { Express } from "express"
import { topicRoutes } from "./topic.route"
import { userRouter } from "./user.roure";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { songRoutes } from "./song.route";
import { playlistRoutes } from "./playlist.route";
import { favoriteRouter } from "./favorite.route";
import { histotyRoute } from "./history.route";


const clientRoutes = (app: Express): void => {

    app.use(`/topic`,AuthMiddleware.isAuthorized ,topicRoutes);
    app.use(`/song`,AuthMiddleware.isAuthorized ,songRoutes);
    app.use(`/playlist`,AuthMiddleware.isAuthorized ,playlistRoutes);
    app.use(`/favorite`,AuthMiddleware.isAuthorized, favoriteRouter)
    app.use(`/history`,AuthMiddleware.isAuthorized, histotyRoute)
    app.use(`/auth`, userRouter);


};

export default clientRoutes;