const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const interviewRoutes =
    require("./routes/interviewRoutes");

app.use("/api", interviewRoutes);

app.get("/", (req, res) => {
    res.send("AI Interview Trainer Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});