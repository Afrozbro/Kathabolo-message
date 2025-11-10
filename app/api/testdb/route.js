import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json({ success: false, message: "MONGODB_URI not found" });
  }

  try {
    await mongoose.connect(uri, { dbName: "katha-bolo" });
    return NextResponse.json({ success: true, message: "✅ MongoDB connected!" });
  } catch (err) {
    console.error("❌ Connection failed:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
