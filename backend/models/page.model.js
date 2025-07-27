import mongoose from "mongoose";
const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    topicTags: [String], // e.g., ["DP", "Knapsack", "Memoization"]
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }], // null for default tags
    roadmap: { type: mongoose.Types.ObjectId, ref: "Roadmap" },
    logs: [{ type: mongoose.Types.ObjectId, ref: "Log" }],
  },
  {
    timestamps: true,
  }
);
const Page = mongoose.model("Page", pageSchema);

export default Page;
