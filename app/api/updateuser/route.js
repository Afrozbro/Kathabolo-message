import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(req) {
  try {
    await connectDB();

    const UserSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        profileicon: {
          type: String,
          default:
            "https://i.ibb.co/xSpRyYmR/gemini-2-5-flash-image-preview-nano-banana-a-A-default-profile-ic.png",
        },
      },
      { timestamps: true }
    );

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const { username, profileicon } = await req.json();

    if (!username || !profileicon) {
      return NextResponse.json(
        { message: "Username and new profileicon are required" },
        { status: 400 }
      );
    }

    // 🟢 Update the user's profile icon
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { profileicon },
      { new: true } // returns updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile icon updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating profileicon:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
