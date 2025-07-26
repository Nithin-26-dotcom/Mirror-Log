import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
export const sendVerificationEmail = async ({ email, username, otp }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"DevTeam" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Account - DevTaskManager",
            html: `
                <h3>Hello ${username},</h3>
                <p>Use the following OTP to verify your email address:</p>
                <h2>${otp}</h2>
                <p>This OTP will expire in 10 minutes.</p>`,
        });

        console.log("Verification email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending verification email:", error);

        throw new ApiError(500, "Failed to send verification email");
    }
};
