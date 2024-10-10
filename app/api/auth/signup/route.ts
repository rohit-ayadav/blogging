import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
await connectDB();

export async function POST(request: NextRequest) {
  const body = await request.json();
  let { name, email, username, password, image, bio } = body;
  if (!username) {
    username = email.split("@")[0];
  } else if (username.trim() === "") {
    username = email.split("@")[0];
  }
  console.log(`\n\nUsername: ${username}\n\n`);
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

    if (existingUsername) {
      return NextResponse.json(
        {
          message: "Username already exists",
          success: false,
        },
        { status: 400 }
      );
    }
    console.log(
      `\n\nUsername: ${username}\nPassword before hashed:${password}\n\n`
    );
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 12);
    // const hashedPassword = password;

    const newUser = {
      name,
      email,
      bio: bio ? bio : "No bio",
      password: hashedPassword,
      image,
      providers: "credentials",
      username,
    };

    console.log(`\n\nNew user: ${newUser}\n\n`);
    await User.create(newUser);
    console.log(`\n\nNew user: ${newUser}\n\n`);
    return NextResponse.json(
      {
        message: "User created successfully",
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
