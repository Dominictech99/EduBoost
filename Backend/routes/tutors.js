const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const upload = require("../middleware/upload");

const router = express.Router();

const filePath = path.join(__dirname, "../data/tutors.json");


router.post(
  "/apply",

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "cv",
      maxCount: 1,
    },
    {
      name: "certificate",
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    try {
      const tutors = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );

      // Check if email already exists
      const existingTutor = tutors.find(
        (tutor) => tutor.email === req.body.email
      );

      if (existingTutor) {
        return res.status(400).json({
          message: "An application with this email already exists.",
        });
      }

      // Check if profile image was uploaded
      if (!req.files.profileImage) {
        return res.status(400).json({
          message: "Profile image is required.",
        });
      }

      // Check if CV was uploaded
      if (!req.files.cv) {
        return res.status(400).json({
          message: "CV is required.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
      );

      const newTutor = {
        id: tutors.length + 1,

        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,

        subject: req.body.subject,
        qualification: req.body.qualification,
        experience: req.body.experience,
        education: req.body.education,
        bio: req.body.bio,

        availability: req.body.availability,
        hours: req.body.hours,

        password: hashedPassword,

        profileImage:
          "/uploads/profile-images/" +
          req.files.profileImage[0].filename,

        cv:
          "/uploads/documents/" +
          req.files.cv[0].filename,

        certificate: req.files.certificate
          ? "/uploads/documents/" +
            req.files.certificate[0].filename
          : "",

        role: "tutor",
        status: "pending",

        createdAt: new Date().toISOString(),
      };

      tutors.push(newTutor);

      fs.writeFileSync(
        filePath,
        JSON.stringify(tutors, null, 2)
      );

      res.status(201).json({
        message:
          "Tutor application submitted successfully. Your application is pending review.",
      });

    } catch (error) {
      console.error("Tutor application error:", error);

      res.status(500).json({
        message: "Server error. Please try again later.",
      });
    }
  }
);


module.exports = router;
