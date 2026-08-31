const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, name, code) {
    const { data, error } = await resend.emails.send({
        from: "EduBoost <onboarding@resend.dev>",
        to: [email],
        subject: "Verify Your EduBoost Account",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>Welcome to EduBoost!</h2>

                <p>Hello <strong>${name}</strong>,</p>

                <p>Thank you for creating an EduBoost account.</p>

                <p>Your verification code is:</p>

                <h1 style="font-size: 40px; letter-spacing: 8px; color: #2563eb;">
                    ${code}
                </h1>

                <p>This code expires in 10 minutes.</p>

                <hr>

                <p>If you didn't create this account, you can safely ignore this email.</p>

                <p><strong>EduBoost Team</strong></p>
            </div>
        `,
    });

    if (error) {
        console.error("RESEND ERROR:", error);
        throw new Error(error.message);
    }

    console.log("Verification email sent:", data.id);
}


async function sendPasswordResetEmail(email, name, code) {
    const { data, error } = await resend.emails.send({
        from: "EduBoost <onboarding@resend.dev>",
        to: [email],
        subject: "Reset Your EduBoost Password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>Password Reset Request</h2>

                <p>Hello <strong>${name}</strong>,</p>

                <p>We received a request to reset your EduBoost account password.</p>

                <p>Your password reset code is:</p>

                <h1 style="font-size: 40px; letter-spacing: 8px; color: #2563eb;">
                    ${code}
                </h1>

                <p>This code expires in <strong>10 minutes</strong>.</p>

                <p>If you didn't request this password reset, you can safely ignore this email.</p>

                <hr>

                <p><strong>EduBoost Team</strong></p>
            </div>
        `,
    });

    if (error) {
        console.error("RESEND PASSWORD RESET ERROR:", error);
        throw new Error(error.message);
    }

    console.log("Password reset email sent:", data.id);
}


module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
};
