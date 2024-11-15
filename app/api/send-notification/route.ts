import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import Notification from "@/models/notification.models";
import { connectDB } from "@/utils/db";
import { getSessionAtHome } from "@/auth";

connectDB();

webpush.setVapidDetails(
  "mailto:rohitkuyada@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export async function POST(req: NextRequest, res: NextResponse) {
  const { title, message } = await req.json();

  if (!title) {
    return NextResponse.json(
      { message: "Title is required", success: false },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json(
      { message: "Message is required", success: false },
      { status: 400 }
    );
  }
  const session = await getSessionAtHome();

  // if (!session) {
  //   return NextResponse.json(
  //     { message: "Not authorized to send notification." },
  //     { status: 401 }
  //   );
  // }
  // if (session.user.role !== "admin") {
  //   return NextResponse.json(
  //     { message: "Not authorized to send notification." },
  //     { status: 401 }
  //   );
  // }

  const payload = JSON.stringify({ title, message });

  try {
    const subscriptions = await Notification.find({});
    for (const { subscription } of subscriptions) {
      await webpush.sendNotification(subscription, payload);
    }
    return NextResponse.json({
      message: "Notification sent",
      success: true
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      {
        message: "Error sending notification",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json(
    { message: "Method not allowed", success: false },
    { status: 405 }
  );
}
