import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

// Cascade delete: remove messages when a chat is deleted
chatSchema.pre("remove", async function (next) {
  const Message = mongoose.model("Message");
  await Message.deleteMany({ chat: this._id });
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
