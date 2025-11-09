import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

// ✅ Define schema (if not already defined globally)
const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    text: String,
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite on hot reload
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    console.log("🧩 ID to delete:", id);

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    // ✅ Connect to MongoDB using your connectDB helper
    await connectDB();

    // ✅ Delete message by ID
    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
