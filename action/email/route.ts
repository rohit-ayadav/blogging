import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error("Missing required SMTP environment variables");
}

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 587,
    secure: false,
    auth: {
        user: smtpUser,
        pass: smtpPassword,
    },
});

export async function POST(request: NextRequest) {
    try {
        const { to, subject, message } = await request.json();


        if (!to || !subject || !message) {
            return new Response("Missing required fields", { status: 400 });
        }

        const info = await transporter.sendMail({
            from: '"TheFoodBlogger" <rohitkuyada@gmail.com>',
            to: to,
            subject: subject,
            text: message,
            html: message,
        });


        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
            info,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}