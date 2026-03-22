import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { parseOrigins } from "./utils/origins";

export let ioInstance: SocketIOServer | null = null;

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: parseOrigins(),
      credentials: true,
      methods: ["GET", "POST"],
    },
  });
  ioInstance = io;
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
