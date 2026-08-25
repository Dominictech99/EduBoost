const students = require("../data/students");

console.log("Students data:", students)
console.log("Is array:", Array.isArray(students))

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
    res.json(students);
};


module.exports = {
    signupStudent,
    loginStudent,
    getStudents
};