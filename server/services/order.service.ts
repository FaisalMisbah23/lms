import { Response } from "express";
import Order from "../models/order.model";

export const getAllOrdersService = async (res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
};
