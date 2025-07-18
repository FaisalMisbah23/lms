import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.routes";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";

dotenv.config();

// body parser
app.use(express.json({ limit: "50mb" }));

// cors
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// cookie parser
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

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

app.use(limiter)
app.use(ErrorMiddleware);
