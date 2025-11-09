import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profileicon: {
      type: String,
      default:
        "https://i.ibb.co/xSpRyYmR/gemini-2-5-flash-image-preview-nano-banana-a-A-default-profile-ic.png",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Prevent model overwrite on hot reload
export default mongoose.models.User ||
  mongoose.model("User", userSchema, "users");
