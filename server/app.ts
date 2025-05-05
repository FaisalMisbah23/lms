import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.Origin,
  })
);

// testing route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
});

// unknown route
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} is not found`) as any;
  err.statusCode = 404;
  next(err);
});
