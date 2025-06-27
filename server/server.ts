import { app } from "./app";
import dotenv from "dotenv";
import connectToDb from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import { initSocketServer } from "./socketServer";
dotenv.config();

const server = http.createServer(app);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

initSocketServer(server);

// create server
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`✅ Server is up and running on port: ${port}`);
  connectToDb();
});
