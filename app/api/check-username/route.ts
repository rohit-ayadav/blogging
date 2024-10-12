import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";

await connectDB();

export async function GET(request: NextRequest) {
  const username = new URLSearchParams(request.nextUrl.searchParams).get(
    "username"
  );
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({
      message: "Username is available",
      available: true,
    });
  }
  return NextResponse.json(
    { error: "Username is not available", available: false },
    { status: 400 }
  );
}
