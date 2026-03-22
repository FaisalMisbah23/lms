import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import Order from "../models/order.model";
import { IOrder } from "../models/order.model";
import { getAllOrdersService } from "../services/order.service";
import { fulfillCoursePurchase } from "../services/orderFulfillment.service";
import { stripeClient } from "../utils/stripeClient";

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, payment_info } = req.body as IOrder;

    if (!courseId) {
      return next(new ErrorHandler("Course id is required", 400));
    }

    if (!payment_info || !("id" in payment_info)) {
      return next(new ErrorHandler("Payment information is required", 400));
    }

    const paymentIntentId = (payment_info as { id: string }).id;
    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      paymentIntentId
    );
    if (paymentIntent.status !== "succeeded") {
      return next(new ErrorHandler("Payment not authorized!", 400));
    }

    const existing = await Order.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
    if (existing) {
      return res.status(201).json({ success: true, order: existing });
    }

    const { order } = await fulfillCoursePurchase({
      userId: String(req.user?._id),
      courseId: String(courseId),
      payment_info: payment_info as Record<string, unknown>,
    });

    return res.status(201).json({ success: true, order });
  }
);

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return next(new ErrorHandler(msg, 400));
    }
  }
);

export const sendStripeKey = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return next(new ErrorHandler(msg, 400));
    }
  }
);

export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, courseId } = req.body as {
      amount?: number;
      courseId?: string;
    };

    if (amount === undefined || amount === null) {
      return next(new ErrorHandler("amount is required", 400));
    }
    if (!courseId) {
      return next(new ErrorHandler("courseId is required", 400));
    }

    const myPayment = await stripeClient.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        userId: String(req.user?._id),
        courseId: String(courseId),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  }
);
