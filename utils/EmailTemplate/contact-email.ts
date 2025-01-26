function confirmationToUser(userName: string, userEmail: string, submissionDate: string) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { padding: 20px; background-color: #f4f4f4; }
        .header { background-color: #4a4a4a; color: white; text-align: center; padding: 10px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DevBlogger Contact Confirmation</h1>
        </div>
        <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for reaching out to DevBlogger! We've received your message and will review it promptly.</p>
            
            <h3>Submission Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${userName}</li>
                <li><strong>Email:</strong> ${userEmail}</li>
                <li><strong>Submitted on:</strong> ${submissionDate}</li>
            </ul>
            
            <p>Our team will respond to your inquiry within 1-2 business days.</p>
            
            <hr>
            <p>Best regards,<br>DevBlogger Support Team</p>
        </div>
        <div class="footer">
            © 2024 DevBlogger. All rights reserved.
        </div>
    </div>
</body>
</html>`;
}

const copyToAdmin = (userName: string, userEmail: string, submissionDate: string, topicCategory: string, messageContent: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; }
        .container { padding: 20px; background-color: #f4f4f4; }
        .header { background-color: #2c3e50; color: white; text-align: center; padding: 10px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; }
        .message-box { background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 10px; margin: 15px 0; }
        .action-required { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New DevBlogger Contact Form Submission</h1>
        </div>
        <div class="content">
            <h2>Contact Details</h2>
            <table width="100%" cellpadding="5" style="border-collapse: collapse;">
                <tr>
                    <td><strong>Name:</strong></td>
                    <td>${userName}</td>
                </tr>
                <tr>
                    <td><strong>Email:</strong></td>
                    <td>${userEmail}</td>
                </tr>
                <tr>
                    <td><strong>Submission Time:</strong></td>
                    <td>${submissionDate}</td>
                </tr>
                <tr>
                    <td><strong>Topic/Category:</strong></td>
                    <td>${topicCategory}</td>
                </tr>
            </table>

            <div class="message-box">
                <h3>Message Content</h3>
                <p>${messageContent}</p>
            </div>

            <div class="action-required">
                <h3>Action Required</h3>
                <ol>
                    <li>Review the message</li>
                    <li>Respond within 1 business day</li>
                    <li>Update contact tracking system</li>
                </ol>
            </div>
        </div>
        <div class="footer">
            © 2025 DevBlogger Contact Management System
        </div>
    </div>
</body>
</html>`;
}

export { confirmationToUser, copyToAdmin };