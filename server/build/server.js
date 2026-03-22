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
require("./envBootstrap");
const app_1 = require("./app");
const db_1 = __importDefault(require("./utils/db"));
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const socketServer_1 = require("./socketServer");
const server = http_1.default.createServer(app_1.app);
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
(0, socketServer_1.initSocketServer)(server);
const port = Number(process.env.PORT || 8000);
server.listen(port, () => {
    console.log(`✅ Server is up and running on port: ${port}`);
    void (0, db_1.default)();
});
const shutdown = (signal) => {
    console.log(`Received ${signal}, shutting down...`);
    try {
        socketServer_1.ioInstance === null || socketServer_1.ioInstance === void 0 ? void 0 : socketServer_1.ioInstance.close(() => {
            console.log("Socket.IO closed");
        });
    }
    catch (e) {
        console.error(e);
    }
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("HTTP server closed");
        try {
            yield mongoose_1.default.connection.close();
            console.log("MongoDB connection closed");
        }
        catch (e) {
            console.error(e);
        }
        process.exit(0);
    }));
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
