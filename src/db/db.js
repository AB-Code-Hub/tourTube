import mongoose from "mongoose";
import { DB_NAME, DB_URL } from "../utils/env.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${DB_URL}/${DB_NAME}`);
    console.log("DB Connected successfully ", connectionInstance.connection.host);
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};


export default connectDB