import { app } from "./app";
import dotenv from "dotenv";
import connectToDb from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`✅ Server is up and running on port: ${port}`);
  connectToDb();
});
