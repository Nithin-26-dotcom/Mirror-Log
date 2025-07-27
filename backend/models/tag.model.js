import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., '@done', '@stuck'
    type: { type: String, enum: ["default", "custom"], default: "custom" },
  },
  {
    timestamps: true,
  }
);
const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
