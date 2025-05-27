"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandlingMiddleware = (err, req, res, next) => {
    if (!err.statusCode)
        err.statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || http_status_codes_1.StatusCodes[err.statusCode],
        stack: err.stack
    };
    res.status(responseError.statusCode).json(responseError);
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;
