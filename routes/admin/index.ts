import { Express } from "express";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { SongRoutes } from "./Song.Router";
import { ArtistRouter } from "./Artist.Router";
import {RoleRouter} from "./Role.Router"
import { TopicRouter } from "./Topic.Router";
import { AlbumRouter } from "./Album.Router";

const adminRoutes = (app: Express): void => {
    // Sử dụng middleware và router đúng cách
    app.use("/song", AuthMiddleware.isManager, SongRoutes);
    app.use('/artist',AuthMiddleware.isManager,ArtistRouter)
    app.use('/role',AuthMiddleware.isAdmin,RoleRouter)
    app.use('/topic',AuthMiddleware.isManager,TopicRouter)
    app.use('/album',AuthMiddleware.isManager,AlbumRouter)
};

export default adminRoutes;