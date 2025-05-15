import { Express } from "express";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { SongRoutes } from "./Song.Router";

const adminRoutes = (app: Express): void => {
    // Sử dụng middleware và router đúng cách
    app.use("/song", AuthMiddleware.isAdmin, SongRoutes);
};

export default adminRoutes;