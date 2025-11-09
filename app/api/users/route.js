import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// ✅ Define your schema & model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ✅ GET route — check if email exists
export async function GET(req) {
  try {
    await connectDB(); // connect to DB

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ exists: false, message: "Email not found" });
    }

    return NextResponse.json({ exists: true, message: "Email exists", user });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
