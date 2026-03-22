import "./envBootstrap";
import { app } from "./app";
import connectToDb from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import mongoose from "mongoose";
import { initSocketServer, ioInstance } from "./socketServer";

const server = http.createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

initSocketServer(server);

const port = Number(process.env.PORT || 8000);

server.listen(port, () => {
  console.log(`✅ Server is up and running on port: ${port}`);
  void connectToDb();
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down...`);
  try {
    ioInstance?.close(() => {
      console.log("Socket.IO closed");
    });
  } catch (e) {
    console.error(e);
  }
  server.close(async () => {
    console.log("HTTP server closed");
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
