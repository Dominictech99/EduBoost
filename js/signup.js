console.log("Student signup JS loaded");

const profileImage = document.getElementById("profileImage");
const imagePreview = document.getElementById("imagePreview");

let profileImageBase64 = "";

profileImage.addEventListener("change", () => {
    const file = profileImage.files[0];

    if (!file) return;

    imagePreview.src = URL.createObjectURL(file);

    const reader = new FileReader();

    reader.onload = function (e) {
        profileImageBase64 = e.target.result;
    };

    reader.readAsDataURL(file);
});

const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Handler fired");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const level = document.getElementById("level").value;

    try {
        console.log("Sending signup request...");
        
const response = await fetch("https://eduboost-x7ia.onrender.com/api/auth/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name,
        email,
        password,
        level,
        profileImage: profileImageBase64,
    }),
});

        const data = await response.json();

        console.log("Signup response:", response.status, data);

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Verification code sent! Redirecting...";

            localStorage.setItem("verificationEmail", email);

            setTimeout(() => {
                window.location.href = "student-verify.html";
            }, 1000);

        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }

    } catch (error) {
        console.error(error);
        message.style.color = "red";
        message.textContent = "Something went wrong. Please try again.";
    }
});