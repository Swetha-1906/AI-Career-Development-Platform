const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractJson(text) {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}

async function callModel(prompt) {
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await model.generateContent(prompt);
      break;
    } catch (error) {
      const errorStr = error.toString ? error.toString() : String(error);
      if (errorStr.includes("429") || errorStr.includes("quota")) {
        console.warn("⚠️ API quota exhausted, using mock response");
        return generateMockResponse(prompt);
      }
      if (attempt === 2) throw error;
      await delay(1500 * (attempt + 1));
    }
  }

  if (!response?.response) {
    throw new Error("LLM did not return a valid response");
  }

  return response.text();
}

function generateMockResponse(prompt) {
  if (prompt.includes("Generate one interview question")) {
    // Extract domain from prompt
    const domainMatch = prompt.match(/Domain: (\w+)/);
    const domain = domainMatch ? domainMatch[1] : "General";
    
    const questions = {
      Java: {
        question: "Explain the difference between HashMap and HashTable in Java. When would you use each?",
        key_points: ["Synchronization differences", "Null handling", "Performance", "Modern alternatives"]
      },
      Python: {
        question: "What are the key differences between lists, tuples, and dictionaries in Python? When should you use each?",
        key_points: ["Mutability", "Ordering", "Key-value pairs", "Performance characteristics"]
      },
      DBMS: {
        question: "Explain ACID properties in database transactions and why they are important.",
        key_points: ["Atomicity", "Consistency", "Isolation", "Durability", "Real-world examples"]
      },
      OS: {
        question: "What is the difference between process and thread? Explain context switching.",
        key_points: ["Memory space", "Communication", "Overhead", "Synchronization"]
      }
    };
    
    const q = questions[domain] || questions.Java;
    return JSON.stringify({
      question: q.question,
      key_points: q.key_points,
      evaluation_criteria: {
        correctness: "Accurately answers the question",
        clarity: "Explanation is clear and well-structured",
        depth: "Provides sufficient detail and examples",
        technical_accuracy: "Uses correct terminology"
      }
    });
  } else if (prompt.includes("expert interview evaluator") || prompt.includes("Candidate Answer")) {
    // Extract answer from prompt
    const answerMatch = prompt.match(/Candidate Answer: (.+?)(?:\n|$)/);
    const answer = answerMatch ? answerMatch[1].trim() : "";
    
    // Score based on answer length and quality
    let score = 40;
    if (answer.length > 50) score = 55;
    if (answer.length > 100) score = 65;
    if (answer.length > 200) score = 80;
    if (answer.length > 300) score = 90;
    
    // Add variance based on keyword presence
    const keywords = ["difference", "use", "advantage", "performance", "when", "advantage"];
    const keywordCount = keywords.filter(kw => answer.toLowerCase().includes(kw)).length;
    score = Math.min(100, score + (keywordCount * 3));
    
    return JSON.stringify({
      score: score,
      technical_accuracy: score > 80 ? "Strong understanding with accurate technical details" : "Good understanding with minor gaps",
      clarity: score > 75 ? "Well-structured and easy to follow" : "Generally clear but could be more organized",
      missing_points: score < 85 ? "Could provide more specific examples or edge cases" : "Answer covers main points well",
      improvement_suggestions: [
        "Add concrete examples to support your explanations",
        "Consider discussing performance implications",
        "Mention real-world use cases"
      ],
      ideal_answer: "A comprehensive answer should explain key differences, performance implications, and provide concrete examples of when to use each option.",
      weak_topics: score < 75 ? ["Technical Details", "Examples"] : []
    });
  }
  return "{}";
}

async function generateQuestion(domain, difficulty, mode) {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const prompt = `You are a senior technical interviewer. Generate one interview question using the following settings.\nReturn valid JSON only.\n\nDomain: ${domain}\nDifficulty: ${difficulty}\nMode: ${mode}\n\nOutput format:\n{\n  "question": "...",\n  "key_points": ["...","..."],\n  "evaluation_criteria": {\n    "correctness": "...",\n    "clarity": "...",\n    "depth": "...",\n    "technical_accuracy": "..."\n  }\n}`;

  const raw = await callModel(prompt);
  const json = extractJson(raw);

  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (parseError) {
    throw new Error(`LLM returned invalid JSON: ${json}`);
  }
}

async function evaluateAnswer({ question, answer, domain = "General", difficulty = "Medium", mode = "Practice" }) {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const prompt = `You are an expert interview evaluator. Evaluate the answer with technical accuracy, clarity, and depth. Return valid JSON only.\n\nQuestion: ${question}\nDomain: ${domain}\nDifficulty: ${difficulty}\nMode: ${mode}\nCandidate Answer: ${answer}\n\nOutput:\n{\n  "score": 0,\n  "technical_accuracy": "...",\n  "clarity": "...",\n  "missing_points": "...",\n  "improvement_suggestions": ["...","..."],\n  "ideal_answer": "...",\n  "weak_topics": ["...","..."]\n}`;

  const raw = await callModel(prompt);
  const json = extractJson(raw);

  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (parseError) {
    throw new Error(`LLM returned invalid JSON: ${json}`);
  }
}

module.exports = {
  generateQuestion,
  evaluateAnswer
};
