window.onload = async function () {

    const container = document.getElementById("scoreResults");

    const userData = JSON.parse(localStorage.getItem("careerUserData"));

    if (!userData) {
        container.innerHTML = "<p>No data found</p>";
        return;
    }

    container.innerHTML = `
        <div class="career-card">
            Generating Career Scores...
        </div>
    `;

    try {

        const response = await fetch("http://localhost:5000/career-scores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!data.advice) {
            throw new Error(
                data.message || "No advice returned from server"
            );
        }

        const lines = data.advice
            .split("\n")
            .filter(line => line.includes("|"));

        let html = `
    <div class="scores-container">
        <div class="cards-grid">
`;

// find best score first
let bestIndex = 0;
let bestScoreValue = -1;

const parsedData = lines.map((line, index) => {

    const parts = line.replace("-", "").split("|");

    const career = parts[0]?.trim();
    const scoreText = parts[1]?.trim();
    const reason = parts[2]?.trim();

    const scoreValue = parseInt(scoreText.replace("%", "")) || 0;

    if (scoreValue > bestScoreValue) {
        bestScoreValue = scoreValue;
        bestIndex = index;
    }

    return { career, scoreText, reason, scoreValue };
});

parsedData.forEach((item, index) => {

    const isBest = index === bestIndex;

    html += `
        <div class="career-score-card ${isBest ? 'best-card' : ''}">
            
            ${isBest ? `<div class="best-badge">⭐ Best Match</div>` : ""}

            <h3>${item.career}</h3>
            <div class="score">${item.scoreText}</div>
            <p>${item.reason}</p>

        </div>
    `;
});

html += `
        </div>
    </div>
`;

container.innerHTML = html;

    } catch (error) {

        container.innerHTML = `
            <div class="career-card">
                Failed to generate scores
            </div>
        `;

        console.error(error);
    }
};

document
.getElementById("voiceBtn")
.addEventListener("click", () => {

    window.location.href =
        "voicechat.html";
});