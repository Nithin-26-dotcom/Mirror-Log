import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    page: { type: mongoose.Types.ObjectId, ref: "Page" },
    content: { type: String, required: true },
    tag: { type: mongoose.Types.ObjectId, ref: "Tag" }, // e.g., '@done', '@stuck'
  },
  {
    timestamps: true,
  }
);
const Log = mongoose.model("Log", logSchema);

export default Log;
