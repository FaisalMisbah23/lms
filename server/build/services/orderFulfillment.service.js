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
exports.fulfillCoursePurchase = fulfillCoursePurchase;
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const redis_1 = require("../utils/redis");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
function fulfillCoursePurchase(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const stripePaymentIntentId = typeof ((_a = params.payment_info) === null || _a === void 0 ? void 0 : _a.id) === "string"
            ? params.payment_info.id
            : undefined;
        if (stripePaymentIntentId) {
            const existing = yield order_model_1.default.findOne({ stripePaymentIntentId });
            if (existing) {
                return { order: existing, isDuplicateIntent: true };
            }
        }
        const user = yield user_model_1.default.findById(params.userId);
        if (!user) {
            throw new ErrorHandler_1.default("User not found", 404);
        }
        const courseExistInUser = user.courses.find((course) => { var _a, _b; return (course.courseId || ((_b = (_a = course._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a))) === params.courseId; });
        if (courseExistInUser) {
            throw new ErrorHandler_1.default("You have already enrolled in this course!", 400);
        }
        const course = yield course_model_1.default.findById(params.courseId);
        if (!course) {
            throw new ErrorHandler_1.default("Course not found", 404);
        }
        const data = {
            courseId: course._id,
            userId: user._id,
            payment_info: params.payment_info,
        };
        if (stripePaymentIntentId) {
            data.stripePaymentIntentId = stripePaymentIntentId;
        }
        let order;
        try {
            order = yield order_model_1.default.create(data);
        }
        catch (err) {
            const e = err;
            if ((e === null || e === void 0 ? void 0 : e.code) === 11000 && stripePaymentIntentId) {
                const existing = yield order_model_1.default.findOne({ stripePaymentIntentId });
                if (existing) {
                    return { order: existing, isDuplicateIntent: true };
                }
            }
            throw err;
        }
        const mailData = {
            order: {
                _id: typeof course._id === "string"
                    ? course._id.slice(0, 6)
                    : ((_c = (_b = course._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b).slice(0, 6)) || "",
                name: course.name,
                price: course.price,
                date: new Date().toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };
        yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails", "order-confirmation.ejs"), { order: mailData });
        try {
            yield (0, sendMail_1.default)({
                email: user.email,
                subject: "Order Confirmation",
                template: "order-confirmation.ejs",
                data: mailData,
            });
        }
        catch (e) {
            throw new ErrorHandler_1.default(e.message, 400);
        }
        user.courses.push({ courseId: String(course._id) });
        yield user.save();
        yield redis_1.redis.set(String(user._id), JSON.stringify(user));
        yield notification_model_1.default.create({
            user: user._id,
            title: "New Order",
            message: `You have a new order from ${course.name}`,
        });
        course.purchased = (course.purchased || 0) + 1;
        yield course.save();
        return { order, isDuplicateIntent: false };
    });
}
