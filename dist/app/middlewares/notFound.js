"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const notFound = (req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Api not Found !!',
        statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
        error: '',
    });
};
exports.default = notFound;
