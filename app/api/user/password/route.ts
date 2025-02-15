import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import { getSessionAtHome } from "@/auth";

await connectDB();

export async function PUT(request: NextRequest) {
  const session = await getSessionAtHome();
  if (!session) { return NextResponse.json({ message: "Not authorized to update password", success: false, }, { status: 401 }); }
  const email = session.user.email;
  if (!request.body) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
  const { oldPassword, newPassword } = JSON.parse(await request.text());

  if (!oldPassword || !newPassword) return NextResponse.json({ message: "Old password and new password are required" }, { status: 400 });

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });

  user.password = newPassword;
  await user.save();
  return NextResponse.json({ message: "Password updated successfully" });
}