import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Message from "@/models/Message";

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    // 🧩 Step 1: Delete user account
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🧩 Step 2: Delete all messages where username is either sender or reciver
    const deletedMessages = await Message.deleteMany({
      $or: [
        { sender: username },
        { reciver: username }
      ],
    });

    return NextResponse.json({
      success: true,
      message: `✅ Account '${username}' and ${deletedMessages.deletedCount} messages deleted successfully.`,
    });

  } catch (error) {
    console.error("❌ Error deleting account or messages:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
