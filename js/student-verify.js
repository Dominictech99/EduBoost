const verifyForm = document.getElementById("verifyForm");
const message = document.getElementById("message");

const email = localStorage.getItem("verificationEmail");


verifyForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const code = document.getElementById("code").value.trim();


    try {

        const response = await fetch(
            "https://eduboost-x7ia.onrender.com/api/admin/api/auth/verify-email",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    code
                })
            }
        );


        const data = await response.json();


        if(response.ok){

            message.style.color = "green";
            message.textContent = "Email verified successfully! Redirecting...";


            localStorage.removeItem("verificationEmail");


            setTimeout(() => {
                window.location.href = "student-login.html";
            }, 1500);


        } else {

            message.style.color = "red";
            message.textContent = data.message;

        }


    } catch(error){

        console.error(error);

        message.style.color = "red";
        message.textContent = "Something went wrong. Try again.";

    }

});