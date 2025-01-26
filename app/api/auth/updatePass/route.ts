// /api/auth/updatePass
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/utils/rate-limit";
import { sendEmail } from "@/action/email/SendEmail";

await connectDB();

export async function PUT(request: NextRequest) {
  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for") ||
    "";

  const isAllowed = rateLimit(ip);
  if (!isAllowed) {
    return NextResponse.json(
      {
        message: "Too many requests, please try again later",
        success: false,
      },
      { status: 429 }
    );
  }

  const body = await request.json();
  let { email, secretKey, newPassword } = body;
  if (!email || !secretKey || !newPassword) {
    return NextResponse.json(
      {
        message: "Email, oldPassword and newPassword are required",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    const isMatch = process.env.SECRET_KEY_PASSWORD === secretKey;
    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid password",
          success: false,
        },
        { status: 401 }
      );
    }
    user.password = newPassword;
    await user.save();
    sendEmail({
      to: email,
      subject: "Password Updated Successfully 🎉",
      message: emailTemplate(user.name, email),
    });

    return NextResponse.json(
      {
        message: "Password updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}

const emailTemplate = (name: string, email: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Password Update Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h1 style="color: #2d3748; margin-bottom: 20px;">Password Update Notification</h1>
            
            <p>Hi ${name},</p>
            
            <p>Your password has been successfully updated for the email: <strong>${email}</strong></p>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #666;">
                If you have any questions, please contact our support team.
            </p>
        </div>
    </body>
    </html>
  `;
};  