"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = exports.ioInstance = void 0;
const socket_io_1 = require("socket.io");
const origins_1 = require("./utils/origins");
exports.ioInstance = null;
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: (0, origins_1.parseOrigins)(),
            credentials: true,
            methods: ["GET", "POST"],
        },
    });
    exports.ioInstance = io;
    io.on("connection", (socket) => {
        console.log("✅ A user connected");
        // list for "notification" event from the frontend
        socket.on("notification", (data) => {
            // broadcast the notification data to all connected clients (admin dashboard)
            io.emit("newNotification", data);
        });
        socket.on("disconnect", () => {
            console.log("❌ A user disconnected");
        });
    });
};
exports.initSocketServer = initSocketServer;
