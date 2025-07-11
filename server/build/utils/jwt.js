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
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = exports.refreshTokenExpires = exports.accessTokenExpires = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("./redis");
dotenv_1.default.config();
// parse environment variables to integrate with fallback values
exports.accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
exports.refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
exports.accessTokenOptions = {
    expires: new Date(Date.now() + exports.accessTokenExpires * 60 * 1000),
    maxAge: exports.accessTokenExpires * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + exports.refreshTokenExpires * 24 * 60 * 1000),
    maxAge: exports.refreshTokenExpires * 24 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = user.signAccessToken();
        const refreshToken = user.signRefreshToken();
        // update session to redis
        yield redis_1.redis.set(user._id, JSON.stringify(user));
        res.cookie("access_token", accessToken, exports.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
        res.status(statusCode).json({
            success: true,
            user,
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.sendToken = sendToken;
