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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AuthService_1 = require("../services/AuthService");
const createAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authRequest = req.body;
        const result = yield AuthService_1.AuthService.createAccount(authRequest);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const setRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account_id, role } = req.body;
        if (!account_id || !role) {
            res.status(400).json({ message: "Thiếu account_id hoặc role" });
        }
        const result = yield AuthService_1.AuthService.setRole(account_id, role);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AuthService_1.AuthService.getRole();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const setDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account_id } = req.params;
        const result = yield AuthService_1.AuthService.setDelete(account_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const setpassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = req.jwtDecoded;
        const account_id = (_a = userData === null || userData === void 0 ? void 0 : userData.userInfo) === null || _a === void 0 ? void 0 : _a.userId;
        const { pass, newpass } = req.body;
        const result = yield AuthService_1.AuthService.setpassword(account_id, pass, newpass);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const setPassDefault = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account_id } = req.params;
        const result = yield AuthService_1.AuthService.setPassDefault(account_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AuthService_1.AuthService.getAccount();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const setStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account_id } = req.params;
        const result = yield AuthService_1.AuthService.setStatus(account_id);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (e) {
        next(e);
    }
});
const getAllAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AuthService_1.AuthService.getAllAccountService();
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = {
    createAccount,
    setRole,
    getRole,
    setDelete,
    setpassword,
    setPassDefault,
    getAccount,
    setStatus,
    getAllAccount
};
