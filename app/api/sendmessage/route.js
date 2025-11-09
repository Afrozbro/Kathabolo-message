// import { connectDB } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import User from "@/models/User";
// import { encrypt } from "@/lib/encryption"; // ✅ make sure this exists

// // 🧩 Define schema (only once)
// const MessageSchema = new mongoose.Schema({
//   sender: String,
//   reciver: String,
//   sharemessage: String,
//   timestamp: { type: Date, default: Date.now },
// });

// // 🧩 Avoid model overwrite in dev
// const Message =
//   mongoose.models.Message || mongoose.model("Message", MessageSchema);

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { sender, reciver, sharemessage } = body;

//     if (!sender || !reciver || !sharemessage) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // ✅ Check if sender exists
//     const checksender = await User.findOne({ username: sender });
//     if (!checksender) {
//       return NextResponse.json(
//         { error: "Sender not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ Check if receiver exists
//     const checkreciver = await User.findOne({ username: reciver });
//     if (!checkreciver) {
//       return NextResponse.json(
//         { error: "Receiver not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ Save message
//     const encencryptedMessage=encrypt(sharemessage)
//     const newMessage = new Message({ sender, reciver, sharemessage:encencryptedMessage });
//     await newMessage.save();

//     return NextResponse.json({ success: true, id: newMessage._id });
//   } catch (error) {
//     console.error("❌ Error saving message:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }






// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const sender = searchParams.get("sender");
//     const reciver = searchParams.get("reciver");

//     if (!sender || !reciver) {
//       return NextResponse.json(
//         { error: "Sender and Receiver required" },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // 🟢 Find all messages between sender and receiver (both directions)
//     const messages = await Message.find({
//       $or: [
//         { sender, reciver },
//         { sender: reciver, reciver: sender },
//       ],
//     }).sort({ timestamp: 1 }); // oldest → newest

//     return NextResponse.json({ success: true, messages });
//   } catch (error) {
//     console.error("❌ Error fetching messages:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { encrypt, decrypt } from "@/lib/encryption"; // ✅ include both

// 🧩 Define schema
const MessageSchema = new mongoose.Schema({
  sender: String,
  reciver: String,
  sharemessage: String,
  seen:Boolean,
  timestamp: { type: Date, default: Date.now },
});

// 🧩 Avoid model overwrite
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export async function POST(req) {
  try {
    const body = await req.json();
    const { sender, reciver, sharemessage,seen } = body;

    if (!sender || !reciver || !sharemessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // ✅ Validate users
    const checksender = await User.findOne({ username: sender });
    if (!checksender) return NextResponse.json({ error: "Sender not found" }, { status: 404 });

    const checkreciver = await User.findOne({ username: reciver });
    if (!checkreciver) return NextResponse.json({ error: "Receiver not found" }, { status: 404 });

    // ✅ Encrypt and save
    const encryptedMessage = encrypt(sharemessage);
    const newMessage = new Message({ sender, reciver, sharemessage: encryptedMessage,seen });
    await newMessage.save();

    return NextResponse.json({ success: true, id: newMessage._id });
  } catch (error) {
    console.error("❌ Error saving message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get("sender");
    const reciver = searchParams.get("reciver");

    if (!sender || !reciver) {
      return NextResponse.json({ error: "Sender and Receiver required" }, { status: 400 });
    }

    await connectDB();

    // 🟢 Fetch messages in both directions
    const messages = await Message.find({
      $or: [
        { sender, reciver },
        { sender: reciver, reciver: sender },
      ],
    }).sort({ timestamp: 1 });

    // 🔓 Decrypt before returning
    const decryptedMessages = messages.map((msg) => ({
      ...msg.toObject(),
      sharemessage: decrypt(msg.sharemessage),
    }));

    return NextResponse.json({ success: true, messages: decryptedMessages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}





