const form = document.getElementById("resetPasswordForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const code = document.getElementById("code").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    try {

        const res = await fetch("http://localhost:3000/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                code,
                newPassword
            })
        });

        const data = await res.json();

        message.textContent = data.message;

        if (res.ok) {
            setTimeout(() => {
                window.location.href = "student-login.html";
            }, 2000);
        }

    } catch (err) {

        console.error(err);

        message.textContent = "Something went wrong.";

    }

});