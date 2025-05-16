import { Express } from "express";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { SongRoutes } from "./Song.Router";
import { ArtistRouter } from "./Artist.Router";

const adminRoutes = (app: Express): void => {
    // Sử dụng middleware và router đúng cách
    app.use("/song", AuthMiddleware.isManager, SongRoutes);
    app.use('/artist',AuthMiddleware.isManager,ArtistRouter)
};

export default adminRoutes;