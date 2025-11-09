import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// ✅ Define schema and model inside this file
const UserSchema =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      username: { type: String, required: true, unique: true },
      profileicon: {
        type: String,
        default:
          "https://i.ibb.co/xSpRyYmR/gemini-2-5-flash-image-preview-nano-banana-a-A-default-profile-ic.png",
      },
    })
  );

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Find user by username
    const user = await UserSchema.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User found",
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
          profileicon:
            user.profileicon ||
            "https://i.ibb.co/xSpRyYmR/gemini-2-5-flash-image-preview-nano-banana-a-A-default-profile-ic.png",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
