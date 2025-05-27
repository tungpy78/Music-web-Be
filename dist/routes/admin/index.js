"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const Song_Router_1 = require("./Song.Router");
const Artist_Router_1 = require("./Artist.Router");
const Role_Router_1 = require("./Role.Router");
const Topic_Router_1 = require("./Topic.Router");
const adminRoutes = (app) => {
    app.use("/song", authMiddleware_1.AuthMiddleware.isManager, Song_Router_1.SongRoutes);
    app.use('/artist', authMiddleware_1.AuthMiddleware.isManager, Artist_Router_1.ArtistRouter);
    app.use('/role', authMiddleware_1.AuthMiddleware.isAdmin, Role_Router_1.RoleRouter);
    app.use('/topic', authMiddleware_1.AuthMiddleware.isManager, Topic_Router_1.TopicRouter);
};
exports.default = adminRoutes;
