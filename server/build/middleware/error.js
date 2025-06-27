"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // JWT error
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler_1.default("Invalid token. Please try again.", 400);
    }
    // JWT expired
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler_1.default("Token has expired. Please log in again.", 400);
    }
    // Send consistent JSON response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
