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
        const info = await transporter.sendMail({
            // from: '"DevBlogger" <info@devblogger.com>',
            from: '"DevBlogger" <rohitkuyada@gmail.com>',
            to: to,
            subject: subject,
            text: message,
            html: message,
        });

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log(info);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        return { message: "Email sending failed", error: error };
    }

    return { message: "Email sent successfully", error: "" };
};

export default sendEmail;
export { sendEmail };