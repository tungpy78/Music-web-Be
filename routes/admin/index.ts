import { Express } from "express";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { SongRoutes } from "./Song.Router";
import { ArtistRouter } from "./Artist.Router";
import {RoleRouter} from "./Role.Router"
import { TopicRouter } from "./Topic.Router";
import { AlbumRouter } from "./Album.Router";
import { UserRouter } from "./User.Router";
import { HistoryActionRouter } from "./HistoryAction.Router";

const adminRoutes = (app: Express): void => {
    // Sử dụng middleware và router đúng cách
    app.use("/admin/song", AuthMiddleware.isManager, SongRoutes);
    app.use('/admin/artist',AuthMiddleware.isManager,ArtistRouter)
    app.use('/admin/role',AuthMiddleware.isAdmin,RoleRouter)
    app.use('/admin/historyAction',AuthMiddleware.isAdmin,HistoryActionRouter)
    app.use('/admin/topic',AuthMiddleware.isManager,TopicRouter)
    app.use('/admin/album',AuthMiddleware.isManager,AlbumRouter)
    app.use(`/admin/auth`, UserRouter);
};

export default adminRoutes;