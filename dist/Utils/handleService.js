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
exports.handleService = void 0;
const AppError_1 = require("./AppError");
const handleService = (serviceFn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield serviceFn();
        return {
            status: 200,
            message: "Success",
            data
        };
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            return {
                status: error.statusCode,
                message: error.message,
                error: error.name
            };
        }
        return {
            status: 500,
            message: "Unexpected error occurred",
            error: error.message || "Unknown"
        };
    }
});
exports.handleService = handleService;
