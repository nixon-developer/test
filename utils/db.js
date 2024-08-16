import mongoose from "mongoose";
import { DB_LOCAL_URL } from './constants';

const connectToDB = async () => {
  if (mongoose.connections[0].readyState) {
    return; // Already connected
  }
  try {
    const DB_OPTIONS = {
      dbName: process.env.DB_NAME_LOCAL,
    };
    await mongoose.connect(`${DB_LOCAL_URL}`, DB_OPTIONS);
    console.log("MongoDB is connected successfully");
  } catch (error) {
    console.error(error);
  }
};

export default connectToDB;
