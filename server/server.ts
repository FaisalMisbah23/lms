import { app } from "./app";
import dotenv from "dotenv";
import connectToDb from "./utils/db";

dotenv.config();

// create server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`✅ Server is up and running on port: ${port}`);
  connectToDb();
});
