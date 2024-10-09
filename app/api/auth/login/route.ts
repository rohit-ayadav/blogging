import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "../../../../models/users.models";
import { getSession } from "next-auth/react";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const session = await getSession({ req });
    if (session) {
      return NextResponse.json({ message: "You are already signed in." }, { status: 400 });
    }

    interface UserData {
      email: string;
      password: string;
    }

    const { email, password } = await req.json() as UserData;

    if (!email || !password) {
      return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({ message: "User created.", token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
