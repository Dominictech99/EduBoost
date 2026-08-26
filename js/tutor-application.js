// ================= PROFILE IMAGE PREVIEW =================

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


// ================= FORM =================

const tutorApplicationForm =
  document.getElementById("tutorApplicationForm");

const password =
  document.getElementById("password");

const confirmPassword =
  document.getElementById("confirmPassword");


tutorApplicationForm.addEventListener("submit", async function (event) {

  event.preventDefault();


  // ================= PASSWORD VALIDATION =================

  if (password.value !== confirmPassword.value) {

    alert("Passwords do not match. Please try again.");

    confirmPassword.focus();

    return;
  }


  if (password.value.length < 6) {

    alert("Password must be at least 6 characters long.");

    password.focus();

    return;
  }


  // ================= GET FORM DATA =================

  const formData = new FormData(tutorApplicationForm);


  // confirmPassword is only for validation
  // We don't need to send it to the backend.
  formData.delete("confirmPassword");


  try {

    // ================= SEND APPLICATION =================

    const response = await fetch(
      "http://localhost:3000/api/tutors/apply",
      {
        method: "POST",
        body: formData
      }
    );


    const data = await response.json();


    console.log(
      "Tutor application response:",
      response.status,
      data
    );


    // ================= SUCCESS =================

    if (response.ok) {

      alert(data.message);

      tutorApplicationForm.reset();

      imagePreview.src = "";
      imagePreview.style.display = "none";

    } else {

      alert(
        data.message ||
        "Unable to submit application."
      );

    }


  } catch (error) {

    console.error(
      "Tutor application error:",
      error
    );

    alert(
      "Unable to connect to the EduBoost server."
    );

  }

});