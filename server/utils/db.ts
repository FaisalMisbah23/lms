import mongoose from "mongoose";

const dbUrl: string = process.env.MONGO_URI || "";

let attempts = 0;
const maxAttempts =
  process.env.NODE_ENV === "production"
    ? 12
    : Number(process.env.DB_CONNECT_MAX_ATTEMPTS || 8);

const connectToDb = async () => {
  if (!dbUrl) {
    console.error("MONGO_URI is not set");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return;
  }

  attempts += 1;
  try {
    const data = await mongoose.connect(dbUrl);
    console.log(`✅ MongoDB connected at host: ${data.connection.host}`);
    attempts = 0;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`MongoDB connection attempt ${attempts} failed:`, message);
    if (attempts >= maxAttempts) {
      console.error("MongoDB: max connection attempts reached, exiting.");
      process.exit(1);
    }
    setTimeout(connectToDb, 5000);
  }
};

export default connectToDb;
