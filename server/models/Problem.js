const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: ["Easy", "Medium", "Hard"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, default: "" },
      },
    ],
    constraints: [
      {
        type: String,
      },
    ],
    leetcodeLink: {
      type: String,
      required: [true, "LeetCode link is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by difficulty
problemSchema.index({ difficulty: 1 });

module.exports = mongoose.model("Problem", problemSchema);
