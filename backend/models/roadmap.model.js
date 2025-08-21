import mongoose from "mongoose";
const roadmapSchema = new mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
    isRecurring: { type: Boolean, default: false },
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
