"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleZodError_1 = require("../errors/handleZodError");
const handleCastError_1 = require("../errors/handleCastError");
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleDuplicateError_1 = require("../errors/handleDuplicateError");
const handleGenericError_1 = require("../errors/handleGenericError");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let error = {
        path: '',
        message: 'Something went wrong',
    };
    if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        error = { msg: err === null || err === void 0 ? void 0 : err.message };
    }
    else if (err.name && err.name === 'ZodError') {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.error;
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.error;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.error;
    }
    else if (err.code && err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.error;
    }
    else if (err instanceof Error) {
        const simplifiedError = (0, handleGenericError_1.handleGenericError)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.error;
    }
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error,
        stack: config_1.default.NODE_ENV === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
