const express = require("express");
const router = express.Router();

const {
    signupStudent,
    loginStudent,
    getStudents
} = require("../controllers/studentController");


router.post("/signup", signupStudent);

router.post("/login", loginStudent);

router.get("/students", getStudents);


module.exports = router;

router.get("/students", getStudents);

router.get("/test-login", (req, res) => {
    res.json({
        message: "Student routes are working"
    });
});