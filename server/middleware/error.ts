import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    err = new ErrorHandler(message, 400);
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token. Please try again.", 400);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token has expired. Please log in again.", 400);
  }

  // Send consistent JSON response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
