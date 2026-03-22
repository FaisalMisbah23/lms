"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
const stripeWebhook_controller_1 = require("./controllers/stripeWebhook.controller");
const origins_1 = require("./utils/origins");
if (process.env.NODE_ENV === "production") {
    exports.app.set("trust proxy", 1);
}
exports.app.use((0, helmet_1.default)());
exports.app.use((0, compression_1.default)());
// Stripe webhook must receive the raw body (before express.json)
exports.app.post("/api/v1/webhook/stripe", express_1.default.raw({ type: "application/json" }), (req, res, next) => {
    void (0, stripeWebhook_controller_1.handleStripeWebhook)(req, res).catch(next);
});
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
exports.app.use((0, cors_1.default)({
    origin: (0, origins_1.parseOrigins)(),
    credentials: true,
}));
exports.app.use((0, cookie_parser_1.default)());
const apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
});
exports.app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, uptime: process.uptime() });
});
exports.app.get("/health/ready", (_req, res) => {
    const dbUp = mongoose_1.default.connection.readyState === 1;
    if (dbUp) {
        res.status(200).json({ ok: true, database: "up" });
    }
    else {
        res.status(503).json({ ok: false, database: "down" });
    }
});
exports.app.use("/api/v1", apiLimiter, user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_routes_1.default, layout_route_1.default);
exports.app.get("/test", (req, res, next) => {
    res.status(201).json({
        success: true,
        message: "API is working",
    });
});
exports.app.all(/(.*)/, (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} is not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.ErrorMiddleware);
