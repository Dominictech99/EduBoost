const fs = require("fs");
const path = require("path");

const lessonsFile = path.join(__dirname, "../data/lessons.json");

// Get all lessons for a course
exports.getLessonsByCourse = (req, res) => {
    const lessons = JSON.parse(fs.readFileSync(lessonsFile));

    const courseLessons = lessons.filter(
        lesson => lesson.courseId === Number(req.params.courseId)
    );

    res.json(courseLessons);
};

// Get one lesson
exports.getLesson = (req, res) => {
    const lessons = JSON.parse(fs.readFileSync(lessonsFile));

    const lesson = lessons.find(
        lesson => lesson.id === Number(req.params.id)
    );

    if (!lesson) {
        return res.status(404).json({
            message: "Lesson not found"
        });
    }

    res.json(lesson);
};