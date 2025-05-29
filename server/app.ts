import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import morgan from "morgan";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.routes";
import layoutRouter from "./routes/layout.route";

dotenv.config();

// body parser
app.use(express.json({ limit: "50mb" }));

// cors
app.use(
  cors({
    origin: process.env.Origin || "http://localhost:3000",
    credentials: true,
  })
);

// cookie parser
app.use(cookieParser());

// routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
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

app.use(ErrorMiddleware);
