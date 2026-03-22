"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripeKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const order_model_1 = __importDefault(require("../models/order.model"));
const order_service_1 = require("../services/order.service");
const orderFulfillment_service_1 = require("../services/orderFulfillment.service");
const stripeClient_1 = require("../utils/stripeClient");
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courseId, payment_info } = req.body;
    if (!courseId) {
        return next(new ErrorHandler_1.default("Course id is required", 400));
    }
    if (!payment_info || !("id" in payment_info)) {
        return next(new ErrorHandler_1.default("Payment information is required", 400));
    }
    const paymentIntentId = payment_info.id;
    const paymentIntent = yield stripeClient_1.stripeClient.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
        return next(new ErrorHandler_1.default("Payment not authorized!", 400));
    }
    const existing = yield order_model_1.default.findOne({
        stripePaymentIntentId: paymentIntentId,
    });
    if (existing) {
        return res.status(201).json({ success: true, order: existing });
    }
    const { order } = yield (0, orderFulfillment_service_1.fulfillCoursePurchase)({
        userId: String((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
        courseId: String(courseId),
        payment_info: payment_info,
    });
    return res.status(201).json({ success: true, order });
}));
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        return next(new ErrorHandler_1.default(msg, 400));
    }
}));
exports.sendStripeKey = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        return next(new ErrorHandler_1.default(msg, 400));
    }
}));
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, courseId } = req.body;
    if (amount === undefined || amount === null) {
        return next(new ErrorHandler_1.default("amount is required", 400));
    }
    if (!courseId) {
        return next(new ErrorHandler_1.default("courseId is required", 400));
    }
    const myPayment = yield stripeClient_1.stripeClient.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
            userId: String((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
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
}));
