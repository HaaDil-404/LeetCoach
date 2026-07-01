const express = require("express");
const router = express.Router();
const {
  getHints,
  getSolutionExplanation,
  chat,
  getCodeReview,
  askKnowledgeBase,
  ragStatus,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

// All AI routes are protected
router.use(protect);

router.post("/hints", getHints);
router.post("/explain", getSolutionExplanation);
router.post("/chat", chat);
router.post("/review", getCodeReview);

// RAG endpoints
router.post("/ask", askKnowledgeBase);
router.get("/rag-status", ragStatus);

module.exports = router;
