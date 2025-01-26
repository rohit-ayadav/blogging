import { sendEmail } from "@/action/email/SendEmail";
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import { SignUpEmailTemplate } from "@/utils/EmailTemplate/auth";
import { NextRequest, NextResponse } from "next/server";
await connectDB();

export async function POST(request: NextRequest) {
  const body = await request.json();
  let { name, email, username, password, image, bio } = body;
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


    const newUser = {
      name,
      email,
      bio: bio ? bio : "",
      password: password,
      image,
      providers: "credentials",
      username,
    };


    await User.create(newUser);
    sendEmail({
      to: email,
      subject: "Welcome to DevBlogger, Registration Successful",
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
