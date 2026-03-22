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
exports.handleStripeWebhook = void 0;
const orderFulfillment_service_1 = require("../services/orderFulfillment.service");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const stripeClient_1 = require("../utils/stripeClient");
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sig = req.headers["stripe-signature"];
    const rawBody = req.body;
    if (!sig || !Buffer.isBuffer(rawBody)) {
        return res.status(400).send("Missing signature or raw body");
    }
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
        return res.status(500).send("Webhook secret not configured");
    }
    let event;
    try {
        event = stripeClient_1.stripeClient.webhooks.constructEvent(rawBody, sig, secret);
    }
    catch (_c) {
        return res.status(400).send("Webhook signature verification failed");
    }
    if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object;
        const userId = (_a = pi.metadata) === null || _a === void 0 ? void 0 : _a.userId;
        const courseId = (_b = pi.metadata) === null || _b === void 0 ? void 0 : _b.courseId;
        if (!userId || !courseId) {
            return res.status(200).json({ received: true, ignored: "missing_metadata" });
        }
        try {
            yield (0, orderFulfillment_service_1.fulfillCoursePurchase)({
                userId,
                courseId,
                payment_info: pi,
            });
        }
        catch (err) {
            if (err instanceof ErrorHandler_1.default &&
                String(err.message).includes("already enrolled")) {
                return res.status(200).json({ received: true });
            }
            console.error("Stripe webhook fulfillment error:", err);
            return res.status(500).json({ error: "fulfillment_failed" });
        }
    }
    return res.status(200).json({ received: true });
});
exports.handleStripeWebhook = handleStripeWebhook;
