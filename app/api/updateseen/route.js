import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function PUT(req) {
  await connectDB();

  try {
    const { messages } = await req.json();
 

    // Extract all _ids of unseen messages
    const ids = messages.map(msg => msg._id);

    // Update all unseen messages in one go
    const result = await Message.updateMany(
      { _id: { $in: ids } },
      { $set: { seen: true } }
    );

    return Response.json({
      success: true,
      message: "All unseen messages marked as seen",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating seen:", error);
    return Response.json({ success: false, error: error.message });
  }
}
