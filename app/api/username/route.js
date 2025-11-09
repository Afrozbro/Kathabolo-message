
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ message: "Username required" }, { status: 400 });
  }

  await connectDB();

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return NextResponse.json({ exists: true });
  }

  return NextResponse.json({ exists: false });
}
