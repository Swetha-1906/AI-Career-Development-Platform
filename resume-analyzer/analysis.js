async function analyzeResume() {

    const res = await fetch("http://localhost:3001/analyze");
    const data = await res.json();

    document.getElementById("loader").style.display = "none";
    document.getElementById("result").style.display = "block";

    if (!data) {
        document.getElementById("loader").innerText =
            "Something went wrong. Try again.";
        return;
    }

    function toPercent(value) {

        if (value === undefined || value === null)
            return 0;

        if (value <= 1)
            return Math.round(value * 100);

        return Math.round(value);
    }

    document.querySelector("h1").innerHTML =
        `AI Resume Intelligence<br>
        <small style="font-size:16px;color:#6b7280;">
            ${data.name || "Unknown"} | ${data.role || "Not Provided"}
        </small>`;

    // ATS SCORE
    const atsScore = toPercent(data.atsScore || 0);

    document.getElementById("atsScore").innerText = atsScore;

    // ATS BREAKDOWN
    const b = data.atsBreakdown || {};

    document.getElementById("atsBreakdown").innerHTML = `
        Keyword Match: ${toPercent(b.keywordMatch)}% <br><br>
        Skill Match: ${toPercent(b.skillMatch)}% <br><br>
        Experience Match: ${toPercent(b.experienceMatch)}% <br><br>
        Format Score: ${toPercent(b.formatScore)}%
    `;

    // ROLE MATCH
    const r = data.roleMatch || {};

    document.getElementById("roleMatch").innerHTML = `
        <b>${toPercent(r.matchPercent || 0)}% Match</b><br><br>
        Best Role: <b>${r.bestRole || "N/A"}</b><br><br>
        <small>${r.reason || ""}</small>
    `;

    // SKILLS
    document.getElementById("skills").innerHTML =
        "<ul>" +
        (data.technicalSkills || [])
            .map(skill => `<li>${skill}</li>`)
            .join("")
        + "</ul>";

    // STRENGTHS
    document.getElementById("strengths").innerHTML =
        "<ul>" +
        (data.strengths || [])
            .map(item => `<li>${item}</li>`)
            .join("")
        + "</ul>";

    // MISSING SKILLS
    document.getElementById("missing").innerHTML =
        "<ul>" +
        (data.missingSkills || [])
            .map(item => `<li>${item}</li>`)
            .join("")
        + "</ul>";

    // PROJECT ANALYSIS
    document.getElementById("projects").innerHTML =
        "<ul>" +
        (data.projectAnalysis || [])
            .map(project => {

                if (typeof project === "string") {
                    return `<li>${project}</li>`;
                }

                return `
                    <li>
                        <b>${project.title || "Project"}</b><br>
                        ${project.description || ""}
                    </li>
                `;
            })
            .join("")
        + "</ul>";

    // INTERVIEW ELIGIBILITY BASED ON ATS SCORE
    const interviewDiv = document.getElementById("interview");

    const interviewBtn = document.getElementById("interviewBtn");
    const careerBtn = document.getElementById("careerBtn");

    if (atsScore >= 70) {

        interviewDiv.innerHTML = `
            <b style="color:#16a34a;">
                Eligible for Interview
            </b>
            <br><br>

            ATS Score: <b>${atsScore}%</b>
            <br><br>

            <small>
                Your resume has achieved the minimum ATS threshold
                required to proceed to the interview assessment stage.
            </small>
        `;

        interviewBtn.disabled = false;
        interviewBtn.style.opacity = "1";

        careerBtn.disabled = true;
        careerBtn.style.opacity = "0.5";

    }
    else {

        interviewDiv.innerHTML = `
            <b style="color:#dc2626;">
                Resume Needs Improvement
            </b>
            <br><br>

            ATS Score: <b>${atsScore}%</b>
            <br><br>

            <small>
                Improve your resume and missing skills before
                attempting the interview assessment.
            </small>
        `;

        interviewBtn.disabled = true;
        interviewBtn.style.opacity = "0.5";

        careerBtn.disabled = false;
        careerBtn.style.opacity = "1";
    }

    // BUTTON NAVIGATION

    interviewBtn.onclick = () => {
        if (atsScore >= 70) {
            window.location.href = "interview.html";
        }
    };

    careerBtn.onclick = () => {
        if (atsScore < 70) {
            window.location.href = "career-guidance.html";
        }
    };

    // SUGGESTIONS
    document.getElementById("suggestions").innerHTML =
        "<ul>" +
        (data.suggestions || [])
            .map(item => `<li>${item}</li>`)
            .join("")
        + "</ul>";
}

analyzeResume();