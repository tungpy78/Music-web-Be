"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteController = void 0;
const http_status_codes_1 = require("http-status-codes");
const favoriteService_1 = require("../services/favoriteService");
const getFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.jwtDecoded.userInfo.userId;
        const result = yield favoriteService_1.favoriteService.getFavoriteService(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.favoriteController = {
    getFavorite
};
