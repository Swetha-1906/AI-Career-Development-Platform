const express = require("express");
const router = express.Router();
const {
  generateQuestion,
  evaluateAnswer
} = require("../controllers/interviewController");

router.post("/question", generateQuestion);
router.post("/evaluate", evaluateAnswer);

module.exports = router;
