import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";

await connectDB();

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json(
      { error: "Request body is null" },
      { status: 400 }
    );
  }
  const { oldPassword, newPassword, email } = JSON.parse(await request.text());

  if (!oldPassword || !newPassword || !email) {
    return NextResponse.json(
      { message: "oldPassword, newPassword, and email are required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid old password" },
      { status: 400 }
    );
  }
  user.password = newPassword;
  await user.save();
  return NextResponse.json({ message: "Password updated successfully" });
}
