"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const handleError = (err, res) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
exports.handleError = handleError;
