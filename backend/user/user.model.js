import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatarUrl: { type: String },
    status: { type: String, enum: ["Online", "Offline"], default: "Offline" },
    blockedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
