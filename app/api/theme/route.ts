import User from "@/models/users.models";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { getSessionAtHome } from "@/auth";

await connectDB();

export async function POST(request: NextRequest) {
  const session = await getSessionAtHome();
  const { theme } = await request.json();
  if (!theme) {
    return NextResponse.json(
      {
        message: "Theme is required",
        success: false
      },
      { status: 400 }
    );
  }

  if (!["light", "dark"].includes(theme)) {
    return NextResponse.json(
      {
        message: "Invalid theme selected",
        success: false
      },
      { status: 400 }
    );
  }

  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to select your theme",
        success: false
      },
      { status: 401 }
    );
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false
        },
        { status: 404 }
      );
    }

    user.theme = theme;
    await user.save();

    return NextResponse.json(
      {
        message: "Theme selected successfully",
        success: true
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "An error occurred while selecting your theme",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to view your theme",
        success: false
      },
      { status: 401 }
    );
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        theme: user.theme,
        success: true
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching your theme",
        success: false
      },
      { status: 500 }
    );
  }
}
