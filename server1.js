// ===========================
// AI Resume Web Backend (Node.js + Python)
// ===========================
const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Allow cross-origin requests (from your frontend)
app.use(cors());

// Parse raw text (resume text)
app.use(bodyParser.text({ limit: "10mb" }));

// Serve frontend from your web folder
app.use(express.static(path.join(__dirname, "../web 4 - Copy")));

// POST route for Python analysis
app.post("/analyze", (req, res) => {
  const python = spawn("python", [path.join(__dirname, "analyzer1.py")]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => (output += data.toString()));
  python.stderr.on("data", (data) => (errorOutput += data.toString()));

  python.on("close", (code) => {
    if (errorOutput) {
      console.error("Python Error:", errorOutput);
      return res.status(500).json({ error: "Python script failed", details: errorOutput });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (err) {
      console.error("JSON Parse Error:", err.message);
      res.status(500).json({ error: "Invalid JSON from Python" });
    }
  });

  // Send resume text to Python
  python.stdin.write(req.body);
  python.stdin.end();
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
  console.log("Frontend available at http://localhost:5000/index.html");
});
