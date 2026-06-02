const form = document.getElementById("careerForm");

form.addEventListener("submit", function(event){

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    const degree =
        document.getElementById("degree").value;

    const branch =
        document.getElementById("branch").value;

    const interests =
        document.getElementById("interests").value;

    const skills =
        document.getElementById("skills").value;

    const goal =
        document.getElementById("goal").value;

    console.log("Name:", name);
    console.log("Degree:", degree);
    console.log("Branch:", branch);
    console.log("Interests:", interests);
    console.log("Skills:", skills);
    console.log("Goal:", goal);

    alert("Career Analysis Started");
});