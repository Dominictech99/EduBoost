const multer = require("multer");
const path = require("path");

// Configure where uploaded files will be stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Profile image
    if (file.fieldname === "profileImage") {
      cb(null, path.join(__dirname, "../uploads/profile-images"));
    } else {
      // CV and certificate
      cb(null, path.join(__dirname, "../uploads/documents"));
    }
  },

  filename: function (req, file, cb) {
    // Create a unique file name
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;