const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Home Route
app.get("/", (req, res) => {
    res.send("Career Advisor Backend Running");
});

// Career Advice Route
app.post("/career-advice", async (req, res) => {
    try {

        const { skills, interests, goal } = req.body;

        const prompt = `
You are a strict career advisor AI.

Rules:
- Keep answers VERY SHORT.
- No explanations.
- Each bullet max 5–7 words.
- Maximum 3 items per section.
- FINAL_RECOMMENDATION must be 2 sentences only.

User data:
Skills: ${skills}
Interests: ${interests}
Goal: ${goal}

Return exactly:

CAREER_PATHS:
- 3 items

MISSING_SKILLS:
- 3 items

ROADMAP:
- 3 items

CERTIFICATIONS:
- 3 items

FINAL_RECOMMENDATION:
2 short sentences only
`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        res.json({
            success: true,
            advice: response.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/career-scores", async (req, res) => {
    try {

        const { skills, interests, goal } = req.body;

        const prompt = `You are an AI Career Ranking System. 
        User Data: Skills: ${skills} Interests: ${interests} Goal: ${goal} 
        TASK: Give 4 best career matches with scores. 
        FORMAT STRICT: CAREERS: 
        - Career | Score% | short reason (max 8 words) 
        - Career | Score% | short reason (max 8 words) 
        - Career | Score% | short reason (max 8 words) 
        - Career | Score% | short reason (max 8 words) `;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 150
        });

        const aiText =
            response.choices[0].message.content;

        res.json({
            success: true,
            advice: aiText
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post("/voice-chat", async (req, res) => {

    try {

        const { message } = req.body;

        const prompt = `
You are an AI Career Coach.

Answer career-related questions clearly and briefly.

Question:
${message}
`;

        const response =
        await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.7,

            max_tokens: 150
        });

        const aiReply =
        response.choices[0].message.content;

        res.json({
            success: true,
            reply: aiReply
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
});