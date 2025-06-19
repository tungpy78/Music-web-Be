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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const Account_model_1 = __importDefault(require("../models/Account.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Role_model_1 = __importDefault(require("../models/Role.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../Utils/AppError"));
const createAccount = (authRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = new Account_model_1.default();
        Object.assign(account, authRequest);
        const hashedPassword = yield bcrypt_1.default.hash("123456", 10);
        account.password = hashedPassword;
        account.role_id = new mongoose_1.default.Types.ObjectId("681b1c1327419f6f6416e117");
        yield account.save();
        const user = new User_model_1.default();
        user.fullname = authRequest.fullname;
        user.email = authRequest.email;
        user.account_id = account.id;
        try {
            yield user.save();
            return "Tạo thành công";
        }
        catch (userError) {
            yield Account_model_1.default.deleteOne({ _id: account._id });
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi tạo user, đã rollback account: " + userError);
        }
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi tạo account: " + e);
    }
});
const setRole = (account_id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_model_1.default.findById(account_id);
        if (!account) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy account với ID đã cho.");
        }
        account.role_id = new mongoose_1.default.Types.ObjectId(role);
        yield account.save();
        return "Cập nhật quyền thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thay đổi quyền: " + e);
    }
});
const getRole = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role_model_1.default.find({});
        return roles;
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi lấy quyền: " + error);
    }
});
const setDelete = (account_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_model_1.default.findById(account_id);
        if (!account) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy account với ID đã cho.");
        }
        account.deleted = !account.deleted;
        yield (account === null || account === void 0 ? void 0 : account.save());
        return "Cập nhập thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xét quyền: " + e);
    }
});
const setpassword = (account_id, pass, newpass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_model_1.default.findById(account_id);
        if (!account) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy account với ID đã cho.");
        }
        const isValid = yield bcrypt_1.default.compare(pass, account.password);
        if (!isValid) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Sai mật khẩu không khớp ");
        }
        account.password = yield bcrypt_1.default.hash(newpass, 10);
        yield account.save();
        return "Cập nhập thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thay đổi mk: " + e);
    }
});
const setPassDefault = (account_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_model_1.default.findById(account_id);
        if (!account) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy account với ID đã cho.");
        }
        account.password = yield bcrypt_1.default.hash("123456", 10);
        yield account.save();
        return "Cập nhập thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi set pass default" + e);
    }
});
const getAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    const accounts = yield Account_model_1.default.find({ role_id: new mongoose_1.default.Types.ObjectId("681b1c1327419f6f6416e117") }, 'phone password role_id status deleted');
    if (!accounts || accounts.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không có tài khoản manager.");
    }
    const result = [];
    for (const account of accounts) {
        const user = yield User_model_1.default.findOne({ account_id: account._id }, 'fullname email ');
        const role = yield Role_model_1.default.findOne({ _id: account.role_id }, 'role_name');
        result.push({
            id: account.id,
            phone: account.phone,
            password: account.password,
            role_name: (role === null || role === void 0 ? void 0 : role.role_name) || null,
            fullname: (user === null || user === void 0 ? void 0 : user.fullname) || null,
            email: (user === null || user === void 0 ? void 0 : user.email) || null,
            status: account === null || account === void 0 ? void 0 : account.status,
            deleted: account === null || account === void 0 ? void 0 : account.deleted
        });
    }
    return result;
});
const setStatus = (account_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_model_1.default.findById(account_id);
        if (!account) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Không tìm thấy account với ID đã cho.");
        }
        account.status = !account.status;
        yield (account === null || account === void 0 ? void 0 : account.save());
        return "Cập nhập thành công";
    }
    catch (e) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Lỗi khi xét status: " + e);
    }
});
const getAllAccountService = () => __awaiter(void 0, void 0, void 0, function* () {
    const getAccount = yield Account_model_1.default.find({ role_id: "681b1c1327419f6f6416e116" });
    return getAccount;
});
exports.AuthService = {
    createAccount,
    setRole,
    getRole,
    setDelete,
    setpassword,
    setPassDefault,
    getAccount,
    setStatus,
    getAllAccountService
};
