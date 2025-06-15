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
exports.AuthMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const JwtProvider_1 = require("../providers/JwtProvider");
const jsonwebtoken_1 = require("jsonwebtoken");
const express_validator_1 = require("express-validator");
const isAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenFromHeader = req.headers.authorization;
    if (!accessTokenFromHeader) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: (Token not found)" });
        return;
    }
    try {
        const accessTokenDecoded = yield JwtProvider_1.JwtProvider.verifyToken(accessTokenFromHeader.substring("Bearer ".length), process.env.ACCESS_TOKEN_SECRET_SIGNATURE);
        req.jwtDecoded = accessTokenDecoded;
        next();
    }
    catch (error) {
        console.log("Token error:", error.message);
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(http_status_codes_1.StatusCodes.GONE).json({ message: "Need to refresh Token" });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Please Login." });
    }
});
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield isAuthorized(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const userData = req.jwtDecoded;
            if (((_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.role) === "Admin") {
                next();
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Forbidden: You are not an admin." + JSON.stringify(userData), });
                return;
            }
        }));
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Please Login.", });
        return;
    }
});
const isManager = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield isAuthorized(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const userData = req.jwtDecoded;
            if (((_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.role) === "Admin" || ((_b = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _b === void 0 ? void 0 : _b.role) === "Manager") {
                next();
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Forbidden: You are not an Manager." + JSON.stringify(userData), });
                return;
            }
        }));
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Please Login.", });
        return;
    }
});
const validateRequest = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const extractedErrors = result.array().map(err => {
            if ('path' in err) {
                return {
                    field: err.path,
                    message: err.msg,
                };
            }
            else {
                return {
                    field: 'unknown',
                    message: err.msg,
                };
            }
        });
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: extractedErrors.map(err => err.message).join(', '),
            errors: extractedErrors,
        });
        return;
    }
    next();
};
exports.AuthMiddleware = {
    isAuthorized,
    isAdmin,
    isManager,
    validateRequest
};
