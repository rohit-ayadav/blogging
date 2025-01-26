function FPEmailTemplate(username: string, resetLink: string) {

    const currentYear = new Date().getFullYear();
    // return this html document to send as email template

    return (
        `

    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>DevBlogger - Password Reset</title>
                        <style>
                            * {
                                box - sizing: border-box;
                            margin: 0;
                            padding: 0;
        }
                            body {
                                font - family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f6f9;
        }
                            .email-container {
                                width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: white;
                            border-radius: 12px;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                            overflow: hidden;
        }
                            .email-header {
                                background - color: #4338ca;
                            color: white;
                            text-align: center;
                            padding: 20px;
        }
                            .email-body {
                                padding: 30px;
        }
                            .reset-button {
                                display: inline-block;
                            background-color: #4338ca;
                            color: white !important;
                            text-decoration: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            margin: 20px 0;
                            font-weight: 600;
                            text-align: center;
                            width: 100%;
        }
                            .footer {
                                background - color: #f1f5f9;
                            text-align: center;
                            padding: 15px;
                            font-size: 12px;
                            color: #64748b;
        }
                            @media only screen and (max-width: 600px) {
            .email - container {
                                width: 100%;
                            border-radius: 0;
            }
                            .email-body {
                                padding: 20px;
            }
        }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h1>DevBlogger</h1>
                                <p>Password Reset Request</p>
                            </div>
                            <div class="email-body">
                                <h2>Hi ${username},</h2>

                                <p>You've requested to reset your password for DevBlogger. Click the button below to proceed:</p>

                                <a href="${resetLink}" class="reset-button">Reset Password</a>

                                <p>If you didn't request this, please ignore the email or contact our support team.</p>

                                <p>This link expires in 10 minutes for your security.</p>

                                <p>Best regards,<br>DevBlogger Team</p>
                            </div>
                            <div class="footer">
                                © ${currentYear} DevBlogger. All rights reserved.
                            </div>
                        </div>
                    </body>
                </html>`
    )
}

function FPSuccesfullyResetPassword(name: string) {
    const currentYear = new Date().getFullYear();
    return (
        `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .email-header {
            background-color: #4338ca;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .email-body {
            padding: 30px;
            text-align: center;
        }
        .success-icon {
            color: #10b981;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #4338ca;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f1f5f9;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>DevBlogger</h1>
        </div>
        <div class="email-body">
            <div class="success-icon">✅</div>
            <h2>Password Reset Successful</h2>
            <h3>Hi ${name},</h3>
            <p>Your password has been successfully changed. If you did not make this change, please contact our support team immediately.</p>
            
            <a href="{loginLink}" class="button">Login to Your Account</a>
            
            <p>For security reasons, we recommend:</p>
            <ul>
                <li>Using a unique, strong password</li>
                <li>Enabling two-factor authentication</li>
                <li>Not sharing your password with anyone</li>
            </ul>
        </div>
        <div class="footer">
            © ${currentYear} DevBlogger. All rights reserved.
        </div>
    </div>
</body>
</html>`
    )
}

export { FPEmailTemplate, FPSuccesfullyResetPassword }