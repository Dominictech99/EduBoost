const express = require("express");
const router = express.Router();

const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

const path = require("path");
const filePath = path.join(__dirname, "..", "data", "students.json");

const SECRET_KEY = "eduboost_secret_key";

// Student Signup

router.post("/signup", async (req, res) => {
  try {
    const students = JSON.parse(fs.readFileSync(filePath));

    const existingStudent = students.find(
      (student) => student.email === req.body.email,
    );

    if (existingStudent) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const newStudent = {
  id: students.length + 1,
  name: req.body.name,
  email: req.body.email,
  password: hashedPassword,
  level: req.body.level,
  profileImage: req.body.profileImage || "",
  role: "student",

  verified: false,
  verificationCode: verificationCode,
  createdAt: new Date().toISOString(),   // ← add this line

  statistics: {
    courses: 0,
    lessons: 0,
    quiz: 0,
    streak: 0,
  },

  courses: [],

  activities: [],
};

    students.push(newStudent);

fs.writeFileSync(filePath, JSON.stringify(students, null, 2));

// Send verification email  
await sendVerificationEmail(
  newStudent.email,
  newStudent.name,
  verificationCode
);



res.json({
  message: "Verification code sent to your email",
});
  } catch (error) {
  console.error("SIGNUP ERROR:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message
  });
}
});



// Student Login

router.post("/login", async (req, res) => {
  const students = JSON.parse(fs.readFileSync(filePath));

  console.log("Login request:", req.body.email);

  const student = students.find((student) => student.email === req.body.email);

  if (!student.verified) {
  return res.status(403).json({
    message: "Invalid login details."
  });
}

  console.log("Student found:", student);

  if (!student) {
    return res.status(401).json({
      message: "please verify your email before loggon in.",
    });
  }

  const passwordMatch = await bcrypt.compare(
    req.body.password,
    student.password,
  );

  console.log("Password match:", passwordMatch);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid login details",
    });
  }

  if (!student.verified) {
  return res.status(403).json({
    message: "Please verify your email before logging in.",
  });
}

  const token = jwt.sign(
    {
      id: student.id,
      role: student.role,
    },
    SECRET_KEY,
    { expiresIn: "2h" },
  );

  res.json({
    message: "Login successful",
    token,
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      level: student.level,
      profileImage: student.profileImage,
      role: student.role,
    },
  });
});

// Forgot Password

router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    const students = JSON.parse(fs.readFileSync(filePath));

    const student = students.find(
      student => student.email === email
    );

    if (!student) {
      return res.status(404).json({
        message: "No account found with that email."
      });
    }

    const resetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    student.resetCode = resetCode;
    student.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    fs.writeFileSync(
      filePath,
      JSON.stringify(students, null, 2)
    );

    await sendPasswordResetEmail(
  student.email,
  student.name,
  resetCode
);

    res.json({
      message: "Password reset code sent successfully."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

// Verify Reset Code

router.post("/verify-reset-code", (req, res) => {

  const { email, code } = req.body;

  const students = JSON.parse(
    fs.readFileSync(filePath)
  );

  const student = students.find(
    student => student.email === email
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found."
    });
  }

  if (student.resetCode !== code) {
    return res.status(400).json({
      message: "Invalid reset code."
    });
  }

  if (Date.now() > student.resetCodeExpires) {
    return res.status(400).json({
      message: "Reset code has expired."
    });
  }

  res.json({
    message: "Code verified successfully."
  });

});

// Reset Password

router.post("/reset-password", async (req, res) => {

  try {

    const { email, code, newPassword } = req.body;

    const students = JSON.parse(
      fs.readFileSync(filePath)
    );

    const student = students.find(
      student => student.email === email
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    if (student.resetCode !== code) {
      return res.status(400).json({
        message: "Invalid reset code."
      });
    }

    if (Date.now() > student.resetCodeExpires) {
      return res.status(400).json({
        message: "Reset code has expired."
      });
    }

    student.password = await bcrypt.hash(newPassword, 10);

    student.resetCode = null;
    student.resetCodeExpires = null;

    fs.writeFileSync(
      filePath,
      JSON.stringify(students, null, 2)
    );

    res.json({
      message: "Password reset successful."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error."
    });

  }

});

// Verify Student Email

router.post("/verify-email", (req, res) => {

  const students = JSON.parse(
    fs.readFileSync(filePath)
  );


  const student = students.find(
    student => student.email === req.body.email
  );


  if (!student) {
    return res.status(404).json({
      message: "Student account not found"
    });
  }

  if (student.verified) {
  return res.status(400).json({
    message: "Email has already been verified."
  });
}

  if (student.verificationCode !== req.body.code) {

    return res.status(400).json({
      message: "Invalid verification code"
    });

  }


  student.verified = true;

  student.verificationCode = null;


  fs.writeFileSync(
    filePath,
    JSON.stringify(students, null, 2)
  );


  res.json({
    message: "Email verified successfully"
  });

});

module.exports = router;
