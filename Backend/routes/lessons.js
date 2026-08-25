const express = require("express");
const router = express.Router();

const {
    getLessonsByCourse,
    getLesson
} = require("../controllers/lessonsController");

// Get all lessons for a course
router.get("/course/:courseId", getLessonsByCourse);

// Get a single lesson
router.get("/:id", getLesson);

module.exports = router;