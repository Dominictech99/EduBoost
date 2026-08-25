const form = document.getElementById("forgotPasswordForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    try {

        const res = await fetch("https://eduboost-x7ia.onrender.com/api/admin/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        message.textContent = data.message;

        if(res.ok){

            setTimeout(()=>{
                window.location.href = `reset-password.html?email=${encodeURIComponent(email)}`;
            },1500);

        }

    } catch(err){

        message.textContent = "Something went wrong.";

    }

});