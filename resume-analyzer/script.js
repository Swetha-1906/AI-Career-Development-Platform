const form = document.getElementById("uploadForm");
const resumeFile = document.getElementById("resumeFile");
const fileName = document.getElementById("fileName");

resumeFile.addEventListener("change", () => {
    fileName.textContent = resumeFile.files[0]?.name || "No file selected";
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;

    if (!resumeFile.files.length) {
        alert("Select resume");
        return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile.files[0]);

    await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    });

    await fetch("http://localhost:3000/setUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role })
    });

    window.location.href = "analysis.html";
});