/**
 * ============================================================
 * config/db.js – MongoDB Connection Helper
 * ============================================================
 * Uses Mongoose to connect to MongoDB.
 * Reads the connection string from the MONGO_URI env variable.
 * Exits the process with code 1 if the connection fails so the
 * developer is immediately aware of the problem.
 * ============================================================
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error and terminate – the server cannot function without a DB
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
