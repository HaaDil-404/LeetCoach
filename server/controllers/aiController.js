const {
  generateHints,
  explainSolution,
  tutorChat,
  reviewCode,
} = require("../services/geminiService");
const { queryRAG, getRAGStatus } = require("../services/ragService");

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

// @desc    Ask the RAG-powered knowledge base a question
// @route   POST /api/ai/ask
// @access  Private
const askKnowledgeBase = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      res.status(400);
      throw new Error("question is required");
    }

    const result = await queryRAG(question.trim());

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get RAG vector store status
// @route   GET /api/ai/rag-status
// @access  Private
const ragStatus = async (req, res, next) => {
  try {
    const status = getRAGStatus();

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHints,
  getSolutionExplanation,
  chat,
  getCodeReview,
  askKnowledgeBase,
  ragStatus,
};
