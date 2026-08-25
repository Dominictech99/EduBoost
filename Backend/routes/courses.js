const express = require("express");
const router = express.Router();

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/coursesController");

router.get("/", getCourses);

router.get("/:id", getCourse);

router.post("/", createCourse);

router.patch("/:id", updateCourse);

router.delete("/:id", deleteCourse);

module.exports = router;