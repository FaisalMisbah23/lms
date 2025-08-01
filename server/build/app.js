"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
dotenv_1.default.config();
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// cors
exports.app.use((0, cors_1.default)({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
}));
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
// routes
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_routes_1.default, layout_route_1.default);
// testing route
exports.app.get("/test", (req, res, next) => {
    res.status(201).json({
        success: true,
        message: "API is working",
    });
});
// unknown route
exports.app.all(/(.*)/, (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} is not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
