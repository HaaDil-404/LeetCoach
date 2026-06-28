const {
  generateHints,
  explainSolution,
  tutorChat,
  reviewCode,
} = require("../services/geminiService");

// @desc    Get AI-generated progressive hints for a problem
// @route   POST /api/ai/hints
// @access  Private
const getHints = async (req, res, next) => {
  try {
    const { problemDescription, difficulty } = req.body;

    if (!problemDescription || !difficulty) {
      res.status(400);
      throw new Error("problemDescription and difficulty are required");
    }

    const hints = await generateHints(problemDescription, difficulty);

    res.status(200).json({
      success: true,
      data: hints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-generated solution explanation
// @route   POST /api/ai/explain
// @access  Private
const getSolutionExplanation = async (req, res, next) => {
  try {
    const { problemDescription, difficulty } = req.body;

    if (!problemDescription || !difficulty) {
      res.status(400);
      throw new Error("problemDescription and difficulty are required");
    }

    const explanation = await explainSolution(problemDescription, difficulty);

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Chat with AI tutor about DSA topics
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res, next) => {
  try {
    const { topic, question } = req.body;

    if (!topic || !question) {
      res.status(400);
      throw new Error("topic and question are required");
    }

    const response = await tutorChat(topic, question);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI code review
// @route   POST /api/ai/review
// @access  Private
const getCodeReview = async (req, res, next) => {
  try {
    const { code, problemDescription } = req.body;

    if (!code) {
      res.status(400);
      throw new Error("code is required");
    }

    const review = await reviewCode(code, problemDescription);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHints, getSolutionExplanation, chat, getCodeReview };
