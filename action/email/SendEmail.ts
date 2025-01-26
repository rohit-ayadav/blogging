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

const emailTemplate = (name: string, email: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Welcome to DevBlogger</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
              <h1 style="color: #2d3748; margin-bottom: 20px;">Welcome to DevBlogger! 🎉</h1>
              
              <p>Hi ${name},</p>
              
              <p>Thank you for joining DevBlogger! Your account has been successfully created with the email: <strong>${email}</strong></p>
              
              <p>With DevBlogger, you can:</p>
              <ul style="padding-left: 20px;">
                  <li>Share your technical knowledge</li>
                  <li>Connect with fellow developers</li>
                  <li>Stay updated with latest tech trends</li>
              </ul>
  
              <p>Join our WhatsApp community for exclusive updates and discussions:</p>
              <div style="text-align: center; margin: 30px 0;">
                  <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" 
                     style="background-color: #25D366; 
                            color: white; 
                            padding: 12px 24px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            font-weight: bold;">
                      Join WhatsApp Channel
                  </a>
              </div>
  
              <p>Start your blogging journey today by logging into your account!</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              
              <p style="font-size: 12px; color: #666;">
                  If you didn't create this account, please ignore this email or contact our support team.
              </p>
          </div>
      </body>
      </html>
    `;
};

const loginSuccessEmail = (name: string, loginTime: string, deviceInfo: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>New Login Detected</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
              <h2 style="color: #2d3748;">New Login Detected</h2>
              
              <p>Hi ${name},</p>
              
              <p>We detected a new login to your DevBlogger account.</p>
              
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>Login Time:</strong> ${loginTime}</p>
                  <p style="margin: 5px 0;"><strong>Device Info:</strong> ${deviceInfo}</p>
              </div>
  
              <p>If this wasn't you, please secure your account immediately by:</p>
              <ol style="padding-left: 20px; margin: 10px 0;">
                  <li>Changing your password</li>
                  <li>Enabling two-factor authentication</li>
                  <li>Contacting our support team</li>
              </ol>
  
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                  <p>Join our community:</p>
                  <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" 
                     style="color: #25D366; text-decoration: none;">
                      WhatsApp Channel →
                  </a>
              </div>
          </div>
      </body>
      </html>
    `;
};

export { sendEmail, emailTemplate, loginSuccessEmail };