import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },
  },
  { timestamps: true }
);

// Compound unique: tag names unique within page, or globally if pageId=null
tagSchema.index({ name: 1, pageId: 1 }, { unique: true });

// Optional safeguard: default tags should not have pageId
tagSchema.pre("save", function (next) {
  if (this.isDefault && this.pageId) {
    return next(new Error("Default tags cannot be tied to a specific page."));
  }
  next();
});
const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
