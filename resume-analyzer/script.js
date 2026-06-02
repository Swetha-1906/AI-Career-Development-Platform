const resumeFile =
document.getElementById("resumeFile");

const fileName =
document.getElementById("fileName");

const analyzeBtn =
document.getElementById("analyzeBtn");

resumeFile.addEventListener("change", () => {

    if(resumeFile.files.length > 0)
    {
        fileName.textContent =
        resumeFile.files[0].name;
    }

});

analyzeBtn.addEventListener("click", () => {

    if(resumeFile.files.length === 0)
    {
        alert("Please upload a resume.");
        return;
    }

    alert("Resume Uploaded Successfully!");

});