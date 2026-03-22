import path from "path";
import ejs from "ejs";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";
import Notification from "../models/notification.model";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";
import ErrorHandler from "../utils/ErrorHandler";

export async function fulfillCoursePurchase(params: {
  userId: string;
  courseId: string;
  payment_info: Record<string, unknown>;
}): Promise<{ order: InstanceType<typeof Order>; isDuplicateIntent: boolean }> {
  const stripePaymentIntentId =
    typeof params.payment_info?.id === "string"
      ? params.payment_info.id
      : undefined;

  if (stripePaymentIntentId) {
    const existing = await Order.findOne({ stripePaymentIntentId });
    if (existing) {
      return { order: existing, isDuplicateIntent: true };
    }
  }

  const user = await User.findById(params.userId);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  const courseExistInUser = user.courses.find(
    (course: { courseId?: string; _id?: { toString?: () => string } }) =>
      (course.courseId || course._id?.toString?.()) === params.courseId
  );
  if (courseExistInUser) {
    throw new ErrorHandler("You have already enrolled in this course!", 400);
  }

  const course = await Course.findById(params.courseId);
  if (!course) {
    throw new ErrorHandler("Course not found", 404);
  }

  const data: Record<string, unknown> = {
    courseId: course._id,
    userId: user._id,
    payment_info: params.payment_info,
  };
  if (stripePaymentIntentId) {
    data.stripePaymentIntentId = stripePaymentIntentId;
  }

  let order;
  try {
    order = await Order.create(data);
  } catch (err: unknown) {
    const e = err as { code?: number };
    if (e?.code === 11000 && stripePaymentIntentId) {
      const existing = await Order.findOne({ stripePaymentIntentId });
      if (existing) {
        return { order: existing, isDuplicateIntent: true };
      }
    }
    throw err;
  }

  const mailData = {
    order: {
      _id:
        typeof course._id === "string"
          ? course._id.slice(0, 6)
          : course._id?.toString?.().slice(0, 6) || "",
      name: course.name,
      price: course.price,
      date: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };

  await ejs.renderFile(
    path.join(__dirname, "../mails", "order-confirmation.ejs"),
    { order: mailData }
  );

  try {
    await sendMail({
      email: user.email,
      subject: "Order Confirmation",
      template: "order-confirmation.ejs",
      data: mailData,
    });
  } catch (e) {
    throw new ErrorHandler((e as Error).message, 400);
  }

  user.courses.push({ courseId: String(course._id) });
  await user.save();

  await redis.set(String(user._id), JSON.stringify(user));

  await Notification.create({
    user: user._id,
    title: "New Order",
    message: `You have a new order from ${course.name}`,
  });

  course.purchased = (course.purchased || 0) + 1;
  await course.save();

  return { order, isDuplicateIntent: false };
}
