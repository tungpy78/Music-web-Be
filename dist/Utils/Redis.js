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
exports.RedisService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
});
const saveOTP = (email_1, otp_1, ...args_1) => __awaiter(void 0, [email_1, otp_1, ...args_1], void 0, function* (email, otp, expireSeconds = 300) {
    yield redis.set(`otp:${email}`, otp, 'EX', expireSeconds);
});
const getOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return redis.get(`otp:${email}`);
});
const deleteOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.del(`otp:${email}`);
});
exports.RedisService = {
    saveOTP,
    getOTP,
    deleteOTP
};
