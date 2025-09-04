import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ["user", "bot"], // sender
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat", // reference to a Chat model (if you create one)
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
