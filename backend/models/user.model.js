import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    picture: {
      type: String,
      default: "",
    },
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Cascade delete: remove all chats when user is deleted
userSchema.pre("remove", async function (next) {
  const Chat = mongoose.model("Chat");
  await Chat.deleteMany({ user: this._id });
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
