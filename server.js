
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Homepage route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

let tasks = [];

// Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Add a task
app.post("/api/tasks", (req, res) => {
    const text = typeof req.body.text === "string"
        ? req.body.text.trim()
        : "";

    if (!text) {
        return res.status(400).json({
            error: "Task text is required."
        });
    }

    const task = {
        id: Date.now(),
        text
    };

    tasks.push(task);

    res.status(201).json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    tasks = tasks.filter(
        task => task.id !== Number(req.params.id)
    );

    res.json({ message: "Task deleted" });
});

// Run locally
if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}

// Export Express app for Vercel
module.exports = app;
