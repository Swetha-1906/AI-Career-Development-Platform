const express = require("express");
const router = express.Router();

const {
    generateQuestion
} = require("../controllers/interviewController");

router.get("/question", generateQuestion);

module.exports = router;