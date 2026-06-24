const Problem = require("../models/Problem");
const DailyChallenge = require("../models/DailyChallenge");

/**
 * Returns the start of today (midnight UTC) for consistent date comparisons.
 */
const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Picks one random problem of the given difficulty that hasn't been
 * recently assigned to this user (best-effort deduplication).
 */
const pickRandomProblem = async (difficulty, excludeIds = []) => {
  const query = { difficulty };
  if (excludeIds.length > 0) {
    query._id = { $nin: excludeIds };
  }

  const count = await Problem.countDocuments(query);
  if (count === 0) {
    // Fallback: pick from all problems of that difficulty if we've exhausted unique ones
    const fallbackCount = await Problem.countDocuments({ difficulty });
    const randomIndex = Math.floor(Math.random() * fallbackCount);
    return Problem.findOne({ difficulty }).skip(randomIndex);
  }

  const randomIndex = Math.floor(Math.random() * count);
  return Problem.findOne(query).skip(randomIndex);
};

/**
 * Generates a new daily challenge for a user, or returns the existing
 * one if already generated today.
 */
const generateDailyChallenge = async (userId) => {
  const today = getTodayDate();

  // Check if a challenge already exists for today
  const existing = await DailyChallenge.findOne({
    userId,
    assignedDate: today,
  })
    .populate("easyProblem")
    .populate("mediumProblem")
    .populate("hardProblem");

  if (existing) {
    return existing;
  }

  // Gather IDs of previously assigned problems (last 30 days) to avoid repeats
  const recentChallenges = await DailyChallenge.find({
    userId,
    assignedDate: {
      $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  const recentProblemIds = recentChallenges.flatMap((c) => [
    c.easyProblem,
    c.mediumProblem,
    c.hardProblem,
  ]);

  // Pick one random problem per difficulty
  const easyProblem = await pickRandomProblem("Easy", recentProblemIds);
  const mediumProblem = await pickRandomProblem("Medium", recentProblemIds);
  const hardProblem = await pickRandomProblem("Hard", recentProblemIds);

  if (!easyProblem || !mediumProblem || !hardProblem) {
    throw new Error(
      "Not enough problems in the database to generate a daily challenge. Please seed the database first."
    );
  }

  const challenge = await DailyChallenge.create({
    userId,
    easyProblem: easyProblem._id,
    mediumProblem: mediumProblem._id,
    hardProblem: hardProblem._id,
    completedProblems: [],
    assignedDate: today,
  });

  // Return populated version
  return DailyChallenge.findById(challenge._id)
    .populate("easyProblem")
    .populate("mediumProblem")
    .populate("hardProblem");
};

module.exports = { generateDailyChallenge, getTodayDate };
