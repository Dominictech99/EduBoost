require("dotenv").config();

const { sendVerificationEmail } = require("./services/emailService");

sendVerificationEmail(
  "eduboost.team@gmail.com",
  "Ekene",
  "123456"
)
  .then(() => {
    console.log("✅ Email sent successfully!");
  })
  .catch((err) => {
    console.error("❌ Failed to send email:");
    console.error(err);
  });