const sendOTP = async (email: string, otp: string, userName: string) => {
    return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td align="center" style="padding: 40px 0; background-color: #4F46E5;">
                <img src="/api/placeholder/120/40" alt="Company Logo" style="display: block; width: 120px; height: 40px;" />
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding: 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <h1 style="margin: 0; color: #333333; font-size: 24px; font-weight: bold;">Verify Your Email</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; line-height: 24px; color: #666666;">
                            <p style="margin: 0;">Dear ${userName},</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; line-height: 24px; color: #666666;">
                            <p style="margin: 0;">Thank you for signing up! To complete your registration, please use the following verification code:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px 0;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color: #F3F4F6; border-radius: 8px; padding: 20px 40px;">
                                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; line-height: 24px; color: #666666;">
                            <p style="margin: 0;">This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; line-height: 24px; color: #666666;">
                            <p style="margin: 0;">For security reasons, please don't share this code with anyone.</p>
                   </tr>
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #EAEAEA;">
                            <p style="margin: 0; color: #666666; font-size: 14px;">If you're having trouble, please contact our support team.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 30px; background-color: #F9FAFB;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 20px; color: #666666; font-size: 14px;">
                            <p style="margin: 0;">
                            <a href="https://blogging-one-omega.vercel.app/" style="color: #4F46E5; text-decoration: none;">DevBlogger,</a>
                            DevBlogger,</a>
                             All rights reserved.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="color: #666666; font-size: 12px; line-height: 20px;">
                            <p style="margin: 0;">
                                This is an automated message, please do not reply to this email.<br>
                                Chinhat, Lucknow, Uttar Pradesh, 226028, India
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
              <p style="margin: 0;">This is an automated email and sent to ${email}. If you have any questions, please contact our<a href="https://blogging-one-omega.vercel.app/contacts" style="color: #4F46E5; text-decoration: none;"> support team</a>.</p>
                   
</body>
</html>`
}

export default sendOTP;