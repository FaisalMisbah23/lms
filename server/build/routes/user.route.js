"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const userRouter = express_1.default.Router();
const authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: { success: false, message: "Too many attempts, try again later." },
});
userRouter.post("/register", authLimiter, user_controller_1.registerUser);
userRouter.post("/activate-user", authLimiter, user_controller_1.activateUser);
userRouter.post("/login", authLimiter, user_controller_1.loginUser);
userRouter.post("/logout", user_controller_1.updateAccessToken, user_controller_1.updateAccessToken, auth_1.isAuthenticated, user_controller_1.logoutUser);
userRouter.post("/refresh-token", user_controller_1.updateAccessToken);
userRouter.get("/me", user_controller_1.updateAccessToken, user_controller_1.updateAccessToken, auth_1.isAuthenticated, user_controller_1.getUser);
userRouter.post("/social-auth", user_controller_1.socialAuth);
userRouter.put("/update-user-info", user_controller_1.updateAccessToken, auth_1.isAuthenticated, user_controller_1.updateUserInfo);
userRouter.put("/update-user-password", user_controller_1.updateAccessToken, auth_1.isAuthenticated, user_controller_1.updatePassword);
userRouter.put("/update-user-avatar", user_controller_1.updateAccessToken, auth_1.isAuthenticated, user_controller_1.updateProfilePicture);
userRouter.get("/get-users", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.getAllUsers);
userRouter.put("/update-user-role", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.updateUserRole);
userRouter.delete("/delete-user/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.deleteUser);
exports.default = userRouter;
