// import { connectDB } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// // 🧩 Define schema (only once)
// const MessageSchema = new mongoose.Schema({
//   sender: String,
//   reciver: String,
//   sharemessage: String,
//   timestamp: { type: Date, default: Date.now },
// });
// const Message =
//   mongoose.models.Message || mongoose.model("Message", MessageSchema);

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const reciver = searchParams.get("reciver");

//     if (!reciver) {
//       return NextResponse.json({ error: "Receiver required" }, { status: 400 });
//     }

//     await connectDB();

//     // 🟢 Find all messages where reciver = "a"
//     // const messages = await Message.find({ reciver }).sort({ timestamp: 1 });
//     const messages = await Message.find({
//       $or: [
//         { reciver }, // messages received by me
//         { sender: reciver }, // messages sent by me
//       ],
//     }).sort({ timestamp: 1 });

//     return NextResponse.json({ success: true, messages });
//   } catch (error) {
//     console.error("❌ Error fetching messages:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User"; // 👈 Make sure this path matches your actual User model

// 🧩 Define schema (only once)
const MessageSchema = new mongoose.Schema({
  sender: String,
  reciver: String,
  sharemessage: String,
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }, // optional if you track seen messages
});
const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reciver = searchParams.get("reciver");

    if (!reciver) {
      return NextResponse.json({ error: "Receiver required" }, { status: 400 });
    }

    await connectDB();

    // 🟢 Find messages involving this user (sent or received)
    const messages = await Message.find({
      $or: [{ reciver }, { sender: reciver }],
    }).sort({ timestamp: 1 }).lean();

    // 🧠 Collect all unique usernames from messages
    const usernames = [
      ...new Set(messages.flatMap((m) => [m.sender, m.reciver])),
    ];

    // 🧩 Fetch profile icons from User model
    const users = await User.find(
      { username: { $in: usernames } },
      { username: 1, profileicon: 1 }
    ).lean();

    // 🗺️ Map usernames → profile icons
    const iconMap = Object.fromEntries(
      users.map((u) => [u.username, u.profileicon])
    );

    // 🧬 Attach icons to each message
    const enrichedMessages = messages.map((m) => ({
      ...m,
      senderIcon: iconMap[m.sender] || "",
      reciverIcon: iconMap[m.reciver] || "",
    }));

    return NextResponse.json({ success: true, messages: enrichedMessages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
