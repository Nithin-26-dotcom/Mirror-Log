import mongoose from "mongoose";
// TODO: future consider adding more fields
// startDate: Date,
// endDate: Date,
// isRecurring: { type: Boolean, default: false },
// priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
const roadmapSchema = new mongoose.Schema(
  {
    pageId: { type: mongoose.Types.ObjectId, ref: "Page", required: true },
    subheadings: [
      {
        title: String,
        todos: [{ type: mongoose.Types.ObjectId, ref: "Todo" }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
