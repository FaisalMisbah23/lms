import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  courseId: string;
  payment_info: object;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    payment_info: Object,
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model("Order", orderSchema);
export default Order;
