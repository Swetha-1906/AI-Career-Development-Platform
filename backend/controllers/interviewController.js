exports.generateQuestion = (req, res) => {

    const questions = [
        "Explain normalization in DBMS.",
        "What is polymorphism in Java?",
        "Difference between process and thread?",
        "What is REST API architecture?",
        "Explain indexing in databases."
    ];

    const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];

    res.json({
        question: randomQuestion
    });
};