const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/tutors.json");


// ================= GET ALL TUTORS =================

router.get("/tutors", (req, res) => {
  try {
    const tutors = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    // Don't send password hashes to the browser
    const safeTutors = tutors.map(({ password, ...tutor }) => tutor);

    res.json(safeTutors);

  } catch (error) {
    console.error("Failed to load tutors:", error);

    res.status(500).json({
      message: "Failed to load tutor applications."
    });
  }
});


// ================= UPDATE TUTOR STATUS =================

router.patch("/tutors/:id/status", (req, res) => {
  try {

    const tutors = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    const tutorId = Number(req.params.id);

    const tutor = tutors.find(
      tutor => tutor.id === tutorId
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found."
      });
    }


    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        message: "Invalid tutor status."
      });
    }


    tutor.status = status;


    fs.writeFileSync(
      filePath,
      JSON.stringify(tutors, null, 2)
    );


    res.json({
      message: `Tutor ${status} successfully.`,
      tutor: {
        id: tutor.id,
        fullName: tutor.fullName,
        status: tutor.status
      }
    });

  } catch (error) {

    console.error("Failed to update tutor status:", error);

    res.status(500).json({
      message: "Failed to update tutor status."
    });

  }
});


module.exports = router;
