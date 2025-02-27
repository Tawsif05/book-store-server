"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const http_status_codes_1 = require("http-status-codes");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    return {
        message: err.message,
        statusCode: http_status_codes_1.StatusCodes.CONFLICT,
        error: err,
    };
};
exports.handleDuplicateError = handleDuplicateError;
