import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";
import { FPEmailTemplate } from "@/utils/EmailTemplate/auth";
import { sendEmail } from "@/action/email/SendEmail";

const resetPasswordRequest = async (user: any, req: NextRequest) => {
    const url = new URL(req.url, `http://${req.headers.get('host')}`);
    let resetPasswordToken: string;
    let subject;

    const currentTime = new Date().getTime();
    const tokenGeneratedAt = user.resetPasswordTokenDate?.getTime();

    // Check if the user has requested a password reset within the last 60 seconds
    if (tokenGeneratedAt && currentTime - tokenGeneratedAt < 60000) {
        throw new Error("Please wait 60 seconds between reset requests");
    }

    const TokenExpirationTime = 600000;

    if (tokenGeneratedAt && (currentTime - tokenGeneratedAt) < TokenExpirationTime) {

        resetPasswordToken = user.resetPasswordToken;
        subject = "Password Reset Request for TheFoodBlogger 01 (Extra Email)";
    } else {
        // Generate a random token for password reset
        resetPasswordToken = cryptoRandomString({ length: 32, type: 'url-safe' });
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenDate = new Date();
        try {
            await user.save();
        } catch (error) {
            throw new Error("Error while saving the user");
        }
        subject = "Password Reset Request for TheFoodBlogger";
    }

    // Encrypt the token and email
    if (!process.env.CRYPTO_SECRET) {
        throw new Error("CRYPTO_SECRET is not defined");
    }
    const encryptedToken = new Cryptr(process.env.CRYPTO_SECRET).encrypt(resetPasswordToken);
    const encryptedEmail = new Cryptr(process.env.CRYPTO_SECRET).encrypt(user.email);
    const resetLink = `${url.origin}/reset-password?token=${encryptedToken}&email=${encryptedEmail}`;

    const renderedEmail = FPEmailTemplate(user.name, resetLink);

    // Send the email
    const { message, error } = await sendEmail({
        to: user.email,
        subject: subject,
        message: renderedEmail,
    });

    if (error) {
        throw new Error(`Error sending email: ${message}`);
    }

    return { message: "Password reset link has been sent to your email" };
};

export async function POST(req: NextRequest) {
    await connectDB();

    const { email, username } = await req.json();

    if (!email && !username) {
        return NextResponse.json({
            error: "Email or username is required"
        }, { status: 400 });
    }

    try {
        // Look for user by email or username
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 400 });
        }

        // Reset password request logic
        const response = await resetPasswordRequest(user, req);
        return NextResponse.json(response);

    } catch (error: any) {
        console.error(`\nError in forgotPassword: ${error}`);
        return NextResponse.json({
            error: error.message || "An error occurred"
        }, { status: 500 });
    }
}
