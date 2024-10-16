import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import exp from "constants";

await connectDB();

export async function GET(request: NextRequest) {
  const SearchParams = request.nextUrl.searchParams;
  const id = SearchParams.get("email");
  // console.log(`\n\nThis is email in app/api/user/route.ts: ${id}\n\n`);
  if (!id) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { email, name, image, bio, username } = body;
  if (!email) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false,
      },
      { status: 400 }
    );
  }
  
  const existingUser = await User.findOne({ username });
  if (existingUser.username !== username) {
    return NextResponse.json(
      {
        message: "Username already exists",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, image, bio, username },
      { new: true }
    );
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}
