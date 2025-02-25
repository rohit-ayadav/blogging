import { sendEmail } from "@/action/email/SendEmail";
import sendOtpModels from "@/models/send-otp.models";
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import { SignUpEmailTemplate } from "@/utils/EmailTemplate/auth";
import { NextRequest, NextResponse } from "next/server";
await connectDB();
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const body = await request.json();
  let { name, email, username, password, image, bio, otp } = body;
  if (!username) {
    username = email.split("@")[0];
  } else if (username.trim() === "") {
    username = email.split("@")[0];
  }

  if (!name) {
    name = email.split("@")[0];
  }
  if (!email) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false,
      },
      { status: 400 }
    );
  }
  if (!password) {
    return NextResponse.json(
      {
        message: "Password is required",
        success: false,
      },
      { status: 400 }
    );
  }
  if (!otp) {
    return NextResponse.json(
      {
        message: "Enter the OTP sent to your email",
        success: false,
      },
      { status: 400 }
    );
  }

  try {

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return NextResponse.json(
        {
          message: "Username already used, please choose another",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
          success: false,
        },
        { status: 400 }
      );
    }

    const user = await sendOtpModels.findOne({ email, isUsed: false });
    if (!user) {
      return NextResponse.json(
        {
          message: "Please request for OTP again",
          success: false,
        },
        { status: 400 }
      );
    }

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
          success: false,
        },
        { status: 400 }
      );
    }


    user.isUsed = true;
    await user.save();
    const newUser = {
      name,
      email,
      bio: bio ? bio : "",
      password: password,
      image,
      providers: "credentials",
      username,
      resetPasswordTokenDate: null,
      resetPasswordToken: null,
      role: "user",
      isEmailVerified: true,
    };

    await User.create(newUser);
    sendEmail({
      to: email,
      subject: "Welcome to TheFoodBlogger, Registration Successful",
      message: SignUpEmailTemplate(name, email),
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        success: true,
        newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create user",
        success: false,
      },
      { status: 500 }
    );
  }
}