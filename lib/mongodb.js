import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "katha-bolo",
    });
    isConnected = true;
    console.log("✅ Connected to katha-bolo DB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
