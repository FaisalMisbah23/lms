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
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_1 = require("../utils/redis");
// get user by id
const getUserById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userJson;
    try {
        userJson = yield redis_1.redis.get(id);
    }
    catch (cacheError) {
        console.warn("Redis read failed in getUserById:", cacheError);
    }
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(201).json({
            success: true,
            user,
        });
    }
    else {
        try {
            const user = yield user_model_1.default.findById(id);
            if (user) {
                res.status(201).json({
                    success: true,
                    user,
                });
                redis_1.redis.set(id, JSON.stringify(user)).catch((e) => console.warn("Redis write failed in getUserById:", e));
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        }
        catch (error) {
            console.warn("Database fallback failed in getUserById:", error);
            res.status(500).json({
                success: false,
                message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to retrieve user",
            });
        }
    }
});
exports.getUserById = getUserById;
// get all users
const getAllUsersService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
});
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = (userId, role, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndUpdate(userId, {
        role,
    }, { new: true });
    if (user && user._id) {
        yield redis_1.redis.set(user._id.toString(), JSON.stringify(user));
    }
    res.status(201).json({
        success: true,
        user,
    });
});
exports.updateUserRoleService = updateUserRoleService;
