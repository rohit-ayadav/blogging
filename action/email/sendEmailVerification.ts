"use server";
import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import jwt from 'jsonwebtoken';
import sendEmail from "./SendEmail";
import { EmailVerificationTemplate } from "@/utils/EmailTemplate/auth";

/**
 * This function sends an email verification link to the user
 * @param email - The email of the user
 * @returns - An object containing the success status and error message
 * @throws - An error if the email is not provided, user is not found, email is already verified, or JWT_SECRET is not defined
 */

export async function sendEmailVerification(email: string) {
    try {
        if (!email) throw new Error("Email is required");
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isEmailVerified) {
            throw new Error("Email is already verified");
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });
        const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${jwtToken}`;

        sendEmail({
            to: user.email,
            subject: "Email Verification Link - TheFoodBlogger",
            message: EmailVerificationTemplate(user.name, verifyUrl)
        });
        return { success: true };
    } catch (error) {
        console.error(`\nError in sendEmailVerification: ${error}`);
        return { success: false, error: (error as Error).message };
    }
}
