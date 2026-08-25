const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

console.log("EduBoost server file loaded");

const app = express();

// Serve frontend files (Eduboost/ folder, one level up from backend/)
app.use(express.static(path.join(__dirname, "..")));

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));


// Test route
app.get("/test", (req, res) => {
    res.json({
        message: "CORS is working"
    });
});


// Student routes
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Tutor routes
// const tutorRoutes = require("./routes/tutorRoutes");
// app.use("/api/tutors", tutorRoutes);

// Course routes
const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);

// Lesson routes 
const lessonRoutes = require("./routes/lessons");
app.use("/api/lessons", lessonRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the EduBoost Backend 🚀");
});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});