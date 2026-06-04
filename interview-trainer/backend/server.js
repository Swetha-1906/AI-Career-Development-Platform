const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const interviewRoutes = require("./routes/interviewRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/interview", interviewRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Interview Trainer backend is running" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI calls will fail without a valid key.");
  }
});
