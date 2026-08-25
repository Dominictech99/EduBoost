const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (response.ok) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("student", JSON.stringify(data.student));
      message.style.color = "green";
      message.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "student-dashboard.html";
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
