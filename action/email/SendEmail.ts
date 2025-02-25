"use server";
import nodemailer from "nodemailer";

interface EmailParams {
    to: string;
    subject: string;
    message: string;
}

interface response {
    message: string;
    error: string;
}

const sendEmail = async ({ to, subject, message }: EmailParams) => {

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpUser || !smtpPassword) {
        return { message: "SMTP configuration is missing", error: "SMTP configuration is missing" };
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

    try {
        const uniqueId = Date.now(); // Unique ID for email
        const info = await transporter.sendMail({
            // from: '"TheFoodBlogger" <info@TheFoodBlogger.com>',
            from: '"TheFoodBlogger" <rohitkuyada@gmail.com>',
            to: to,
            subject: subject,
            text: message,
            html: message,
            messageId: uniqueId.toString(),

            headers: {
                "X-Entity-Ref-ID": uniqueId.toString(),
                "X-Entity-Ref-Type": "email",
            },
            date: new Date(),
        });

    } catch (error) {
        console.error("Error sending email:", error);
        return { message: "Email sending failed", error: error };
    }

    return { message: "Email sent successfully", error: "" };
};

export default sendEmail;
export { sendEmail };