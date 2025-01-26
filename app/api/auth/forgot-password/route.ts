import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";
import { FPEmailTemplate } from "./FPEmailTemplate";
import { sendEmail } from "@/action/email/SendEmail";

export async function POST(req: NextRequest) {
    await connectDB();

    const { email, username } = await req.json();

    if (!email && !username) return NextResponse.json({
        error: "Email or username is required"
    }, { status: 400 });

    const url = new URL(req.url, `http://${req.headers.get('host')}`);

    console.log(`Request from ${url.origin}\n\nin ${url.pathname}\n\n`);

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return NextResponse.json({
        error: "User not found"
    }, { status: 400 });
    // Generate a random token for password reset
    const resetPasswordToken = cryptoRandomString({ length: 32, type: 'url-safe' });
    user.resetPasswordToken = resetPasswordToken;
    await user.save();

    // encrypt the token and send it to the user's email
    if (!process.env.CRYPTO_SECRET) {
        throw new Error("CRYPTO_SECRET is not defined");
    }
    const encryptedToken = new Cryptr(process.env.CRYPTO_SECRET).encrypt(resetPasswordToken);
    const encryptedEmail = new Cryptr(process.env.CRYPTO_SECRET).encrypt(email);
    const resetLink = `${url.origin}/reset-password?token=${encryptedToken}&email=${encryptedEmail}`;

    const renderedEmail = FPEmailTemplate(username, resetLink);
    // send the email
    const { message, error } =
        await sendEmail({ to: email, subject: "Password Reset for DevBlogger", message: renderedEmail });
    if (error) return NextResponse.json({
        error: "Please try again later"
    }, { status: 500 });

    return NextResponse.json({
        message: "Password reset link has been sent to your email"
    });
}
