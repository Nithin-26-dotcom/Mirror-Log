import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., '@done', '@stuck'
    isDefault: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // Reference to the User model
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    }, // Reference to the Page model
  },
  {
    timestamps: true,
  }
);
const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
