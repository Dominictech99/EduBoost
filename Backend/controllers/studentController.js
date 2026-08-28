const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "students.json");

const getStudentsData = () => {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// Register student
const signupStudent = (req, res) => {
    const student = req.body;

    students.push(student);

    res.status(201).json({
        message: "Student registered successfully!",
        student
    });
};


// Login student
const loginStudent = (req, res) => {
    const { email, password } = req.body;

    const student = students.find(
        (student) =>
            student.email === email &&
            student.password === password
    );

    if (!student) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        student
    });
};


// Get students
const getStudents = (req, res) => {
    try {
        const students = getStudentsData();

        res.json(students);
    } catch (error) {
        console.error("GET STUDENTS ERROR:", error);

        res.status(500).json({
            message: "Could not load students"
        });
    }
};


module.exports = {
    signupStudent,
    loginStudent,
    getStudents
};