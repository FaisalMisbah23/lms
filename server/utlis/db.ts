import mongoose from "mongoose";

const dbUrl: string = process.env.MONGO_URI || "";

const connectToDb = async () => {
  await mongoose
    .connect(dbUrl)
    .then((data) => {
      console.log(`✅ MongoDB connected at host: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err.message);
      setTimeout(connectToDb, 5000);
    });
};

export default connectToDb;
