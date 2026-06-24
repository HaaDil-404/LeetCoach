const express = require("express");
const router = express.Router();
const {
  generateChallenge,
  getTodayChallenge,
  markProblemComplete,
} = require("../controllers/challengeController");
const { protect } = require("../middleware/auth");

// All challenge routes are protected
router.use(protect);

router.post("/generate", generateChallenge);
router.get("/today", getTodayChallenge);
router.put("/complete/:problemId", markProblemComplete);

module.exports = router;
