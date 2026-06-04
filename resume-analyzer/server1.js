const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

function fixScore(value) {

    if (value === undefined || value === null) return 0;

    // CASE 1: AI gives decimal (0.8, 0.7)
    if (value > 0 && value <= 1) {
        return Math.round(value * 100);
    }

    // CASE 2: already percentage (80, 90)
    if (value > 1 && value <= 100) {
        return Math.round(value);
    }

    return 0;
}
/* ------------------ SAFE JSON PARSER ------------------ */
function safeParse(text) {
    try {
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");

        if (start === -1 || end === -1) return null;

        return JSON.parse(cleaned.slice(start, end + 1));
    } catch (err) {
        console.log("❌ JSON PARSE ERROR");
        return null;
    }
}

/* ------------------ MAIN API ------------------ */
app.get("/analyze", async (req, res) => {

    try {

        // GET DATA FROM UPLOAD SERVER
        let uploadData;

        try {
            uploadData = await axios.get("http://localhost:3000/data");
        } catch (err) {
            return res.json({
                name: "",
                role: "",
                atsScore: 0,
                technicalSkills: [],
                strengths: ["Upload server not reachable"],
                missingSkills: [],
                projectAnalysis: [],
                suggestions: []
            });
        }

        const { resumeText, name, role } = uploadData.data;

        if (!resumeText) {
            return res.json({
                name,
                role,
                atsScore: 0,
                technicalSkills: [],
                strengths: ["No resume found"],
                missingSkills: [],
                projectAnalysis: [],
                suggestions: []
            });
        }

        /* ------------------ PROMPT ------------------ */
const prompt = `
You are an advanced AI Resume Analyzer and ATS Evaluation System.

Candidate Name: ${name}
Applied Role: ${role}

Analyze the resume specifically for the applied role.

Evaluation Criteria:
1. ATS compatibility
2. Skill relevance to the applied role
3. Project relevance to the applied role
4. Resume structure and professionalism
5. Strengths
6. Missing skills for the applied role
7. Interview readiness

IMPORTANT RULES:

- ATS Score must be between 0 and 100.
- ATS Score MUST depend on the Applied Role.
- Missing skills MUST be based on the Applied Role.
- Role Match MUST compare the resume against the Applied Role.
- Suggestions MUST be role-specific.
- Project analysis should explain whether projects are relevant to the Applied Role.

Return ONLY valid JSON.

Format:
{
  "atsScore": 0,
  "atsBreakdown": {
    "keywordMatch": 0,
    "skillMatch": 0,
    "experienceMatch": 0,
    "formatScore": 0
  },
  "roleMatch": {
    "matchPercent": 0,
    "bestRole": "",
    "reason": ""
  },
  "technicalSkills": [],
  "strengths": [],
  "missingSkills": [],
  "projectAnalysis": [
    {
      "title": "",
      "description": ""
    }
  ],
  "interviewEligibility": {
    "eligible": "",
    "confidence": 0,
    "reason": ""
  },
  "suggestions": []
}

Resume:
${resumeText}
`;
        /* ------------------ OPENROUTER CALL ------------------ */
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "meta-llama/llama-3.1-8b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiText = response.data.choices[0].message.content;

        console.log("RAW AI RESPONSE:\n", aiText);

        let result = safeParse(aiText);

        /* ------------------ FALLBACK ------------------ */
        if (!result) {
            result = {
                atsScore: 50,
                atsBreakdown: {
                    keywordMatch: 50,
                    skillMatch: 50,
                    experienceMatch: 50,
                    formatScore: 50
                },
                roleMatch: {
                    matchPercent: 50,
                    bestRole: "Software Engineer",
                    reason: "Fallback response"
                },
                technicalSkills: [],
                strengths: [],
                missingSkills: [],
                projectAnalysis: [],
                interviewEligibility: {
                    eligible: "Maybe",
                    confidence: 50,
                    reason: "Fallback"
                },
                suggestions: []
            };
        }

        /* ------------------ FINAL RESPONSE ------------------ */
        res.json({
            name,
            role,

            atsScore: fixScore(result.atsScore),

            atsBreakdown: {
                keywordMatch: fixScore(result.atsBreakdown?.keywordMatch),
                skillMatch: fixScore(result.atsBreakdown?.skillMatch),
                experienceMatch: fixScore(result.atsBreakdown?.experienceMatch),
                formatScore: fixScore(result.atsBreakdown?.formatScore)
            },

            roleMatch: {
                matchPercent: fixScore(result.roleMatch?.matchPercent),
                bestRole: result.roleMatch?.bestRole || "N/A",
                reason: result.roleMatch?.reason || ""
            },

            technicalSkills: result.technicalSkills || [],
            strengths: result.strengths || [],
            missingSkills: result.missingSkills || [],

            projectAnalysis: result.projectAnalysis || [],

            interviewEligibility: {
                eligible: result.interviewEligibility?.eligible || "N/A",
                confidence: fixScore(result.interviewEligibility?.confidence),
                reason: result.interviewEligibility?.reason || ""
            },

            suggestions: result.suggestions || []
        });

    } catch (err) {
        console.log("SERVER ERROR:", err.message);

        res.json({
            name: "",
            role: "",
            atsScore: 0,
            technicalSkills: [],
            strengths: [],
            missingSkills: [],
            projectAnalysis: [],
            suggestions: ["Server error"]
        });
    }
});

/* ------------------ START SERVER ------------------ */
app.listen(3001, () => {
    console.log("🚀 ANALYSIS SERVER RUNNING ON 3001");
});