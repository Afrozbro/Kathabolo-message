// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb"; // ✅ path to your file
// import User from "@/models/User"; // we'll define this next

// export async function POST(req) {
//   try {
//     await connectDB(); // ✅ connect to DB

//     const { name, email, profileicon, username } = await req.json();
//     console.log("🧠 Incoming data:", { name, email, profileicon, username });

//     // Don't require profileicon from the client. If it's empty string or missing
//     // use the server-side default so the DB doesn't end up with an empty string.
//     const DEFAULT_PROFILE_ICON =
//       "https://i.ibb.co/0y5dds2D/seedream-4-high-res-fal-a-Abstract-UI-avatar-i.jpg";

//     const profileIconToSave =
//       profileicon && profileicon.toString().trim() !== ""
//         ? profileicon
//         : DEFAULT_PROFILE_ICON;

//     if (!name || !email || !username) {
//       return NextResponse.json({ message: "Missing fields" }, { status: 400 });
//     }

//     // Check if username already exists
//     const existing = await User.findOne({ username });
//     if (existing) {
//       return NextResponse.json(
//         { message: "Username already exists" },
//         { status: 409 }
//       );
//     }

//     // Save new user
//     const newUser = await User.create({
//       name,
//       email,
//       profileicon: profileIconToSave,
//       username,
//     });

//     console.log("✅ Saved user:", newUser);

//     return NextResponse.json(
//       { message: "User created successfully", user: newUser },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ Error saving user:", error);

//     // Handle Mongo duplicate key error (email or username unique constraint)
//     if (error && error.code === 11000) {
//       const fields = Object.keys(error.keyValue || {}).join(", ");
//       return NextResponse.json(
//         { message: `Duplicate field(s): ${fields}` },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }









import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // your DB connection file

export async function POST(req) {
  try {
    // 🟢 Step 1: Connect to MongoDB
    await connectDB();

    // 🟢 Step 2: Define Schema (safe from re-declaration)
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
      { timestamps: true } // adds createdAt, updatedAt
    );

    // 🟢 Step 3: Define Model safely
    const User =
      mongoose.models.User || mongoose.model("User", UserSchema);

    // 🟢 Step 4: Parse incoming data
    const { name, email, username, profileicon } = await req.json();

    if (!name || !email || !username) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🟢 Step 5: Check if username already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    // 🟢 Step 6: Create new user
    const newUser = await User.create({
      name,
      email,
      username,
      profileicon:
        profileicon && profileicon.trim() !== ""
          ? profileicon
          : undefined, // default will apply if undefined
    });

    console.log("✅ Saved user:", newUser);

    // 🟢 Step 7: Return success
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving user:", error);

    // Handle Mongo duplicate key error
    if (error.code === 11000) {
      const fields = Object.keys(error.keyValue || {}).join(", ");
      return NextResponse.json(
        { message: `Duplicate field(s): ${fields}` },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
