// /api/auth/updatePass
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/utils/rate-limit";

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
