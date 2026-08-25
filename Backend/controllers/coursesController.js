const fs = require("fs");
const path = require("path");

const coursesFile = path.join(__dirname, "../data/courses.json");

// Get all courses
exports.getCourses = (req, res) => {
    const courses = JSON.parse(fs.readFileSync(coursesFile));
    res.json(courses);
};

// Get one course
exports.getCourse = (req, res) => {
    const courses = JSON.parse(fs.readFileSync(coursesFile));

    const course = courses.find(
        c => c.id === Number(req.params.id)
    );

    if (!course) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    res.json(course);
};

// Create course
exports.createCourse = (req, res) => {

    const courses = JSON.parse(fs.readFileSync(coursesFile));

    const newCourse = {
        id: Date.now(),
        ...req.body
    };

    courses.push(newCourse);

    fs.writeFileSync(
        coursesFile,
        JSON.stringify(courses, null, 2)
    );

    res.status(201).json(newCourse);

};

// Update course
exports.updateCourse = (req, res) => {

    const courses = JSON.parse(fs.readFileSync(coursesFile));

    const index = courses.findIndex(
        c => c.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    courses[index] = {
        ...courses[index],
        ...req.body
    };

    fs.writeFileSync(
        coursesFile,
        JSON.stringify(courses, null, 2)
    );

    res.json(courses[index]);

};

// Delete course
exports.deleteCourse = (req, res) => {

    const courses = JSON.parse(fs.readFileSync(coursesFile));

    const filtered = courses.filter(
        c => c.id !== Number(req.params.id)
    );

    fs.writeFileSync(
        coursesFile,
        JSON.stringify(filtered, null, 2)
    );

    res.json({
        message: "Course deleted"
    });

};