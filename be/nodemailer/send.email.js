import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./email.template.js";
import { sender, transporter } from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, name, verificationToken) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{name}', name).replace('{verificationCode}', verificationToken),
        })
    } catch (error) {
        console.log(`Error sending verification email: `, error);
        throw new Error(`Error sending verification email: ${error.message}`)
    }
}
export const sendWelcomeEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Welcome to our website",
            html: WELCOME_EMAIL_TEMPLATE.replace('{name}', name).replace('{dashboardUrl}', process.env.CLIENT_URL),
        })
    } catch (error) {
        console.log(`Error sending welcome email: `, error);
        throw new Error(`Error sending welcome email: ${error.message}`)
    }
}

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{name}', name).replace('{resetURL}', resetUrl),
        })
    } catch (error) {
        console.log(`Error sending password reset email: `, error);
        throw new Error(`Error sending password reset email: ${error.message}`)
    }
}
export const sendResetSuccessEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password reset successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{name}', name),
        })
    } catch (error) {
        console.log(`Error sending password reset success email: `, error);
        throw new Error(`Error sending password reset success email: ${error.message}`)
    }
}