interface SendOTPParams {
    email: string;
    otp: string;
    userName: string;
    companyInfo?: {
        name?: string;
        logo?: string;
        website?: string;
        supportEmail?: string;
    };
}

const sendOTP = async ({
    email,
    otp,
    userName,
    companyInfo = {
        name: 'DevBlogger',
        logo: 'https://www.devblogger.in/logo.png',
        website: 'https://www.devblogger.in',
        supportEmail: 'support@devblogger.com'
    }
}: SendOTPParams) => {
    const currentDate = new Date().toDateString();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Verify Your Email - ${companyInfo.name}</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }
      @media (prefers-color-scheme: dark) {
        .dark-mode { background-color: #1a1a1a !important; color: #ffffff !important; }
        .dark-mode-text { color: #ffffff !important; }
        .dark-mode-bg { background-color: #2d2d2d !important; }
        .dark-mode-button { background-color: #6366f1 !important; }
      }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;" class="dark-mode">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" class="dark-mode-bg">
        <!-- Header -->
        <tr>
            <td align="center" style="padding: 40px 0; background-color: #4F46E5; border-radius: 8px 8px 0 0;">
                <a href="${companyInfo.website}" style="text-decoration: none;">
                    <img src="${companyInfo.logo}" alt="${companyInfo.name} Logo" style="display: block; width: 120px; height: 40px;" />
                </a>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding: 40px 30px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <h1 style="margin: 0; color: #333333; font-size: 24px; font-weight: bold;" class="dark-mode-text">Verify Your Email</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; line-height: 24px; color: #666666;" class="dark-mode-text">
                            <p style="margin: 0;">Dear ${userName},</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; line-height: 24px; color: #666666;" class="dark-mode-text">
                            <p style="margin: 0;">Thank you for signing up! Please use this verification code to complete your registration:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px 0;">
                            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 20px 40px; display: inline-block;" class="dark-mode-bg">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;" class="dark-mode-text">${otp}</span>
                            </div>
                            <p style="margin-top: 15px; font-size: 14px; color: #666666;" class="dark-mode-text">
                                Code expires in <span style="font-weight: bold;">10 minutes</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; background-color: #FEF3C7; border-radius: 6px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400E; font-size: 14px;">
                                ⚠️ Never share this code with anyone. Our team will never ask for your code.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #EAEAEA;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <p style="margin: 0; color: #666666; font-size: 14px;" class="dark-mode-text">
                                            If you didn't request this code, please 
                                            <a href="${companyInfo.website}/contacts" style="color: #4F46E5; text-decoration: none;">report suspicious activity</a>.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 30px; background-color: #F9FAFB; border-radius: 0 0 8px 8px;" class="dark-mode-bg">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <p style="margin: 0; color: #666666; font-size: 14px;" class="dark-mode-text">
                                <a href="${companyInfo.website}" style="color: #4F46E5; text-decoration: none;">${companyInfo.name}</a>
                                © ${new Date().getFullYear()} All rights reserved.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="color: #666666; font-size: 12px; line-height: 20px;" class="dark-mode-text">
                            <p style="margin: 0;">
                                Sent to ${email} on ${currentDate}<br>
                                Chinhat, Lucknow, Uttar Pradesh, 226028, India
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <a href="${companyInfo.website}/contacts" style="color: #4F46E5; text-decoration: none; font-size: 12px; margin: 0 10px;">Help</a>
                                    </td>
                                    <td>
                                        <a href="${companyInfo.website}/privacy" style="color: #4F46E5; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy</a>
                                    </td>
                                    <td>
                                        <a href="${companyInfo.website}/tos" style="color: #4F46E5; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export default sendOTP;