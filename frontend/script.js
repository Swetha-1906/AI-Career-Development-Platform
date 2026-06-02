let currentQuestion = "";

// 🎯 Get Question from Backend API
document.getElementById("questionBtn").onclick = async function () {

    try {

        const response = await fetch(
            "http://localhost:5000/api/question"
        );

        const data = await response.json();

        currentQuestion = data.question;

        document.getElementById("questionBox").innerText =
            currentQuestion;

        document.getElementById("resultBox").innerText = "";
        document.getElementById("scoreBadge").innerText = "--";

    } catch (error) {

        console.error(error);

        document.getElementById("questionBox").innerText =
            "Failed to load question.";
    }
};


// 🎯 Evaluate Answer (Temporary Mock Version)
document.getElementById("evaluateBtn").onclick = function () {

    let answer = document.getElementById("answerBox").value;

    if (!answer.trim()) {
        alert("Please write an answer first!");
        return;
    }

    // Temporary Score
    let score = Math.floor(Math.random() * 40 + 60);

    document.getElementById("scoreBadge").innerText = score;

    let feedback =
`Score: ${score}/100

Question:
${currentQuestion}

Feedback:
Good attempt, but needs more technical depth.

Suggestions:
• Add technical keywords
• Include real-world examples
• Explain concepts step-by-step
• Improve answer structure`;

    document.getElementById("resultBox").innerText = feedback;
};