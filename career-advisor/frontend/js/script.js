document.getElementById("careerForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const skills = document.getElementById("skills").value;
    const interests = document.getElementById("interests").value;
    const goal = document.getElementById("goal").value;

    const resultBox = document.getElementById("careerResults");

    resultBox.innerHTML = `
        <div class="career-card">
            Analyzing Career...
        </div>
    `;

    try{

        const response = await fetch(
            "http://localhost:5000/career-advice",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    skills,
                    interests,
                    goal
                })
            }
        );

        const data = await response.json();

        const advice = data.advice;

        const careerPaths =
            advice.match(/CAREER_PATHS:([\s\S]*?)MISSING_SKILLS:/)?.[1] || "";

        const missingSkills =
            advice.match(/MISSING_SKILLS:([\s\S]*?)ROADMAP:/)?.[1] || "";

        const roadmap =
            advice.match(/ROADMAP:([\s\S]*?)CERTIFICATIONS:/)?.[1] || "";

        const certifications =
            advice.match(/CERTIFICATIONS:([\s\S]*?)FINAL_RECOMMENDATION:/)?.[1] || "";

        const recommendation =
            advice.match(/FINAL_RECOMMENDATION:([\s\S]*)/)?.[1] || "";

       resultBox.innerHTML = `

<div class="cards-grid">

    <div class="section-card">
        <h3>🎯 Career Paths</h3>
        <pre>${careerPaths}</pre>
    </div>

    <div class="section-card">
        <h3>📚 Missing Skills</h3>
        <pre>${missingSkills}</pre>
    </div>

    <div class="section-card">
        <h3>🛣 Learning Roadmap</h3>
        <pre>${roadmap}</pre>
    </div>

    <div class="section-card">
        <h3>🏆 Certifications</h3>
        <pre>${certifications}</pre>
    </div>

</div>

<div class="final-card">
    <h3>⭐ Final Recommendation</h3>
    <p>${recommendation}</p>
</div>
`;
       localStorage.setItem("careerAdvice", data.advice);

    }
    catch(error){

        resultBox.innerHTML = `
            <div class="career-card">
                Failed to generate career advice.
            </div>
        `;

        console.error(error);
    }

});

document.getElementById("nextPageBtn").addEventListener("click", function () {

    const userData = {
        skills: document.getElementById("skills").value,
        interests: document.getElementById("interests").value,
        goal: document.getElementById("goal").value
    };

    localStorage.setItem("careerUserData", JSON.stringify(userData));

    window.location.href = "scores.html";
});

document.getElementById("downloadPdfBtn")
.addEventListener("click", generatePDF);

function generatePDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const advice =
        localStorage.getItem("careerAdvice") || "";

    // User details
    const name =
        document.getElementById("name").value || "Student";

    const goal =
        document.getElementById("goal").value || "-";

    const date =
        new Date().toLocaleDateString();

    // ===== Header =====
    pdf.setFillColor(0, 119, 182);
    pdf.rect(0, 0, 210, 30, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont(undefined, "bold");

    pdf.text("AI CAREER ADVISOR REPORT", 20, 18);

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    let y = 45;

    // ===== Student Info =====
    pdf.setFontSize(12);

    pdf.text(`Name: ${name}`, 20, y);
    y += 8;

    pdf.text(`Career Goal: ${goal}`, 20, y);
    y += 8;

    pdf.text(`Generated On: ${date}`, 20, y);
    y += 15;

    const lines = advice.split("\n");

    lines.forEach(line => {

        if (
            line.includes("CAREER_PATHS") ||
            line.includes("MISSING_SKILLS") ||
            line.includes("ROADMAP") ||
            line.includes("CERTIFICATIONS") ||
            line.includes("FINAL_RECOMMENDATION")
        ) {

            y += 8;

            // Light blue header box
            pdf.setFillColor(230, 244, 255);

            pdf.rect(15, y - 6, 180, 10, "F");

            pdf.setFontSize(14);
            pdf.setFont(undefined, "bold");

            pdf.text(
                line.replace(":", ""),
                20,
                y
            );

            y += 10;

            pdf.setFont(undefined, "normal");
            pdf.setFontSize(11);
        }

        else if (line.trim() !== "") {

            const cleaned =
                line.replace("-", "•");

            const wrapped =
                pdf.splitTextToSize(cleaned, 160);

            pdf.text(wrapped, 25, y);

            y += wrapped.length * 6 + 2;
        }

        if (y > 270) {

            pdf.addPage();
            y = 20;
        }
    });

    // ===== Footer =====
    pdf.setFontSize(10);

    pdf.setTextColor(100);

    pdf.text(
        "Generated by AI Career Advisor",
        20,
        290
    );

    pdf.save("Career_Report.pdf");
}