const express = require("express");
const router = express.Router();
const {
  getHints,
  getSolutionExplanation,
  chat,
  getCodeReview,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

// All AI routes are protected
router.use(protect);

router.post("/hints", getHints);
router.post("/explain", getSolutionExplanation);
router.post("/chat", chat);
router.post("/review", getCodeReview);

module.exports = router;
