import mongoose from "mongoose";
const pageSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },

    topicTags: [String], // e.g., ["DP", "Knapsack", "Memoization"]
  },
  {
    timestamps: true,
  }
);
const Page = mongoose.model("Page", pageSchema);

export default Page;
