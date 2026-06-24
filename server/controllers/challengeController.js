const DailyChallenge = require("../models/DailyChallenge");
const User = require("../models/User");
const {
  generateDailyChallenge,
  getTodayDate,
} = require("../services/challengeService");

// @desc    Generate daily challenge for the logged-in user
// @route   POST /api/challenges/generate
// @access  Private
const generateChallenge = async (req, res, next) => {
  try {
    const challenge = await generateDailyChallenge(req.user._id);

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's daily challenge for the logged-in user
// @route   GET /api/challenges/today
// @access  Private
const getTodayChallenge = async (req, res, next) => {
  try {
    const today = getTodayDate();

    const challenge = await DailyChallenge.findOne({
      userId: req.user._id,
      assignedDate: today,
    })
      .populate("easyProblem")
      .populate("mediumProblem")
      .populate("hardProblem")
      .populate("completedProblems");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message:
          "No challenge found for today. Generate one first via POST /api/challenges/generate.",
      });
    }

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a problem as completed in today's challenge
// @route   PUT /api/challenges/complete/:problemId
// @access  Private
const markProblemComplete = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const today = getTodayDate();

    const challenge = await DailyChallenge.findOne({
      userId: req.user._id,
      assignedDate: today,
    });

    if (!challenge) {
      res.status(404);
      throw new Error("No daily challenge found for today");
    }

    // Verify the problem belongs to today's challenge
    const challengeProblemIds = [
      challenge.easyProblem.toString(),
      challenge.mediumProblem.toString(),
      challenge.hardProblem.toString(),
    ];

    if (!challengeProblemIds.includes(problemId)) {
      res.status(400);
      throw new Error("This problem is not part of today's challenge");
    }

    // Check if already completed
    if (challenge.completedProblems.map(String).includes(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Problem already marked as completed",
      });
    }

    // Add to completed list
    challenge.completedProblems.push(problemId);
    await challenge.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalSolved += 1;

    // Streak logic: check if user was active yesterday
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayChallenge = await DailyChallenge.findOne({
      userId: req.user._id,
      assignedDate: yesterday,
    });

    const wasActiveYesterday =
      yesterdayChallenge && yesterdayChallenge.completedProblems.length > 0;

    // Only update streak when completing the FIRST problem of the day
    if (challenge.completedProblems.length === 1) {
      if (wasActiveYesterday) {
        user.currentStreak += 1;
      } else {
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    }

    await user.save();

    // Return populated challenge
    const updatedChallenge = await DailyChallenge.findById(challenge._id)
      .populate("easyProblem")
      .populate("mediumProblem")
      .populate("hardProblem")
      .populate("completedProblems");

    res.status(200).json({
      success: true,
      message: "Problem marked as completed!",
      data: {
        challenge: updatedChallenge,
        user: {
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          totalSolved: user.totalSolved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateChallenge, getTodayChallenge, markProblemComplete };
