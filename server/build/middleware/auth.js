"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.authorizeRoles = exports.isAuthenticated = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
// authenticated user
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.default("Access token is not valid!", 400));
    }
    let user;
    try {
        user = yield redis_1.redis.get(decoded.id);
    }
    catch (cacheError) {
        console.warn("Redis read failed in isAuthenticated:", cacheError);
    }
    if (!user) {
        try {
            const User = (yield Promise.resolve().then(() => __importStar(require("../models/user.model")))).default;
            const dbUser = yield User.findById(decoded.id);
            if (!dbUser) {
                return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
            }
            req.user = dbUser.toObject();
            redis_1.redis.set(decoded.id, JSON.stringify(dbUser), "EX", 7 * 24 * 60 * 60).catch((e) => console.warn("Redis write failed in isAuthenticated:", e));
            return next();
        }
        catch (error) {
            console.warn("Database fallback failed in isAuthenticated:", error);
            return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
        }
    }
    req.user = JSON.parse(user);
    next();
}));
// validate user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new ErrorHandler_1.default(`Role:${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resource`, 400));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
