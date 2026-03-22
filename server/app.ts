import "dotenv/config";
import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.routes";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";
import { handleStripeWebhook } from "./controllers/stripeWebhook.controller";
import { parseOrigins } from "./utils/origins";

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(compression());

// Stripe webhook must receive the raw body (before express.json)
app.post(
  "/api/v1/webhook/stripe",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response, next: NextFunction) => {
    void handleStripeWebhook(req, res).catch(next);
  }
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(
  cors({
    origin: parseOrigins(),
    credentials: true,
  })
);

app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

app.get("/health/ready", (_req: Request, res: Response) => {
  const dbUp = mongoose.connection.readyState === 1;
  if (dbUp) {
    res.status(200).json({ ok: true, database: "up" });
  } else {
    res.status(503).json({ ok: false, database: "down" });
  }
});

app.use(
  "/api/v1",
  apiLimiter,
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
});

app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} is not found`) as Error & {
    statusCode?: number;
  };
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
