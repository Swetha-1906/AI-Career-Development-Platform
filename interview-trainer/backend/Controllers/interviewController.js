const aiService = require("../services/aiService");

exports.generateQuestion = async (req, res) => {
  try {
    const { domain, difficulty, mode } = req.body;

    if (!domain || !difficulty || !mode) {
      return res.status(400).json({ success: false, message: "domain, difficulty and mode are required" });
    }

    const question = await aiService.generateQuestion(domain, difficulty, mode);

    return res.json({ success: true, question });
  } catch (error) {
    console.error("generateQuestion error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Unable to generate question" });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, domain, difficulty, mode } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "question and answer are required" });
    }

    const evaluation = await aiService.evaluateAnswer({ question, answer, domain, difficulty, mode });
    console.log("evaluateAnswer response:", evaluation);

    return res.json({ success: true, evaluation });
  } catch (error) {
    console.error("evaluateAnswer error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Unable to evaluate answer" });
  }
};
