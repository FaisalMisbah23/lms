import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { Response } from "express";
import Order from "../models/order.model";

export const newOrder = CatchAsyncError(async (data: any, res: Response) => {
  const order = await Order.create(data);
  res.status(201).json({
    success: true,
    order,
  });
});

// get all orders
export const getAllOrdersService = async (res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
};
