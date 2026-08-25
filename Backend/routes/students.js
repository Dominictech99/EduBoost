const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const authenticateToken = require("../middleware/auth");

const filePath = path.join(__dirname, "..", "students.json");

// Get student stats (total, verified, unverified) — must come BEFORE "/:id"
router.get("/stats", (req, res) => {
  try {
    const students = JSON.parse(fs.readFileSync(filePath));

    const total = students.length;
    const verified = students.filter((s) => s.verified === true).length;
    const unverified = total - verified;

    res.json({
      total,
      verified,
      unverified,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get student profile
router.get("/:id", authenticateToken, (req, res) => {

    // Get all students (for admin dashboard)
router.get("/", (req, res) => {
  try {
    const students = JSON.parse(fs.readFileSync(filePath));

    // Strip sensitive fields before sending to frontend
    const safeStudents = students.map((s) => ({
  id: s.id,
  name: s.name,
  email: s.email,
  level: s.level,
  profileImage: s.profileImage,
  verified: s.verified,
  createdAt: s.createdAt || null,   // ← add this
}));

    res.json(safeStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

    // Check that the logged-in student is requesting their own profile
    if (Number(req.params.id) !== req.user.id) {
    return res.status(403).json({
        message: "Unauthorized"
    });
}

    const students = JSON.parse(
        fs.readFileSync(filePath)
    );

    const student = students.find(
        student => student.id == req.params.id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }


    res.json({
    id: student.id,
    name: student.name,
    email: student.email,
    level: student.level,
    profileImage: student.profileImage,
    role: student.role,

    statistics: student.statistics || {
        courses: 0,
        lessons: 0,
        quiz: 0,
        streak: 0
    },

    courses: student.courses || [],

    activities: student.activities || []
});

});

module.exports = router;