const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdf = require("pdf-parse");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

let globalData = {
    resumeText: "",
    name: "",
    role: ""
};

app.post("/upload", (req, res) => {

    const uploadSingle = upload.single("resume");

    uploadSingle(req, res, async (err) => {
        if (err) return res.status(500).json({ error: "upload failed" });

        const buffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(buffer);

        globalData.resumeText = pdfData.text;

        res.json({ success: true });
    });
});

app.post("/setUser", (req, res) => {
    globalData.name = req.body.name || "";
    globalData.role = req.body.role || "";
    res.json({ success: true });
});

app.get("/data", (req, res) => {
    res.json(globalData);
});

app.listen(3000, () => {
    console.log("UPLOAD SERVER RUNNING 3000");
});