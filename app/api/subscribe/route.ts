import Newsletter from "@/models/newsletter.models";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { getSessionAtHome } from "@/auth";

await connectDB();

export async function POST(request: NextRequest) {
  if (!request.body) { return NextResponse.json({ message: "Invalid request body" }, { status: 400 }); }

  const { email } = await request.json();
  const session = await getSessionAtHome();

  if (!email) { return NextResponse.json({ message: "Email is required", success: false }, { status: 400 }); }

  try {
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) { return NextResponse.json({ message: "You are already subscribed", success: false }, { status: 400 }); }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();
    return NextResponse.json({ message: "You have successfully subscribed", success: true });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while subscribing", success: false }, { status: 500 });
  }
}

// GET /api/subscribe
export async function GET() {
  const session = await getSessionAtHome();

  if (!session) { return NextResponse.json({ message: "You need to be logged in to fetch subscribers", success: false }, { status: 401 }); }

  try {
    const subscribers = await Newsletter.find();
    return NextResponse.json({ subscribers, success: true });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while fetching subscribers", success: false }, { status: 500 });
  }
}