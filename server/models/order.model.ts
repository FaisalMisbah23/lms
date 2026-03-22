import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  courseId: string;
  payment_info: object;
  stripePaymentIntentId?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    payment_info: Object,
    stripePaymentIntentId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, courseId: 1 });
orderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.model("Order", orderSchema);
export default Order;
