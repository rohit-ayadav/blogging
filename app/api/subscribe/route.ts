import Newsletter from "@/models/newsletter.models";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";

await connectDB();

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json(
      {
        message: "Request body is missing",
        success: false,
      },
      { status: 400 }
    );
  }

  const { email } = await request.json();

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
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();
    return NextResponse.json(
      {
        message: "Subscribed successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while subscribing",
        success: false,
      },
      { status: 500 }
    );
  }
}