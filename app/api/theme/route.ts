import User from "@/models/users.models";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { getSessionAtHome } from "@/auth";

await connectDB();

// Helper function for sending responses
const sendResponse = (status: number, message: string, extraData = {}) =>
  NextResponse.json({ success: status < 400, message, ...extraData }, { status });

export async function POST(request: NextRequest) {
  const session = await getSessionAtHome();
  if (!session) return sendResponse(401, "You need to be logged in to select your theme");

  const { theme } = await request.json();
  if (!["light", "dark", "system"].includes(theme)) return sendResponse(400, "Invalid theme selected");

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) return sendResponse(404, "User not found");
    
    // console.log(`User theme updated to ${theme} for ${JSON.stringify(session.user)}`);
    return user ? sendResponse(200, "Theme updated successfully") : sendResponse(404, "User not found");
  } catch {
    return sendResponse(500, "An error occurred while updating the theme");
  }
}

export async function GET(request: NextRequest) {
  const session = await getSessionAtHome();
  if (!session) return sendResponse(401, "You need to be logged in to view your theme");

  try {
    const user = await User.findOne({ email: session.user.email });
    return user ? sendResponse(200, "Theme fetched successfully", { theme: user.theme }) : sendResponse(404, "User not found");
  } catch {
    return sendResponse(500, "An error occurred while fetching the theme");
  }
}