"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    return {
        message: err.message,
        statusCode: 400,
        error: err,
    };
};
exports.handleCastError = handleCastError;
