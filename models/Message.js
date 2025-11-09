import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String,
  reciver: String,
  sharemessage: String,
  seen:{ type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
