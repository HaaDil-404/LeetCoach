const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    easyProblem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    mediumProblem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    hardProblem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    completedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    assignedDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: one challenge per user per day
dailyChallengeSchema.index({ userId: 1, assignedDate: 1 }, { unique: true });

module.exports = mongoose.model("DailyChallenge", dailyChallengeSchema);
