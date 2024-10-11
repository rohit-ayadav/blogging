import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";

await connectDB();

export async function GET(request: NextRequest) {
  // id is after the last slash in the URL

  const id = request.nextUrl.pathname.split("/").pop();
  console.log(`\n\nThis is id in app/api/user/route.ts: ${id}\n\n`);
  if (!id) {
    return NextResponse.json(
      {
        message: "User ID is required",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const user = await User.findById(id);
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
