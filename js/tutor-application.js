const profileImage = document.getElementById("profileImage");
const imagePreview = document.getElementById("imagePreview");

profileImage.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
      imagePreview.src = event.target.result;
      imagePreview.style.display = "block";
    });

    reader.readAsDataURL(file);
  }
});

const tutorApplicationForm = document.getElementById("tutorApplicationForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

tutorApplicationForm.addEventListener("submit", function (event) {
  // Stop the form from submitting immediately
  event.preventDefault();

  // Check if the passwords match
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match. Please try again.");

    confirmPassword.focus();
    return;
  }

  // Check password length
  if (password.value.length < 6) {
    alert("Password must be at least 6 characters long.");

    password.focus();
    return;
  }

  // If everything is correct
  alert("Application is valid and ready to be submitted!");

  console.log("Tutor application passed validation.");
});