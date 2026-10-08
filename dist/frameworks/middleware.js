"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const error_1 = require("../shared/error");
const logger_1 = require("../shared/logger");
const errorMiddleware = (err, req, res, next) => {
    logger_1.logger.error(err.message, err);
    if (err instanceof error_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};
exports.errorMiddleware = errorMiddleware;
