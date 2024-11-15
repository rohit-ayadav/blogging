import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification.models";
import { connectDB } from "@/utils/db";

connectDB();

webpush.setVapidDetails(
  "mailto:rohitkuyada@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

const isValidSubscription = (subscription: any) => {
  if (
    !subscription ||
    !subscription.endpoint ||
    !subscription.keys ||
    !subscription.keys.auth ||
    !subscription.keys.p256dh
  ) {
    return false;
  }
  return true;
};

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("req.body" + req.body);
  if (!req.body) {
    return NextResponse.json(
      { message: "Invalid request", success: false },
      { status: 400 }
    );
  }

  const { subscription } = await req.json();
  console.log("subscription" + subscription);

  if (Object.keys(subscription).length === 0) {
    // if (!subscription) {
    return NextResponse.json(
      { message: "Subscription is required", success: false },
      { status: 400 }
    );
  }

  if (!isValidSubscription(subscription)) {
    return NextResponse.json(
      { message: "Invalid subscription", success: false },
      { status: 400 }
    );
  }

  try {
    // Check if subscription already exists
    const existingSubscription = await Notification.findOne({ subscription });
    if (existingSubscription) {
      return NextResponse.json({
        message: "Subscription already exists",
        success: true
      });
    }

    await Notification.create({ subscription });
    return NextResponse.json({
      message: "Notification subscription saved",
      success: true
    });
  } catch (error) {
    console.error("Error saving notification subscription:", error);
    return NextResponse.json(
      {
        message: "Error saving notification subscription",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const notifications = await Notification.find();
    return NextResponse.json({ notifications, success: true });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        message: `Error fetching notifications: ${error}` || error,
        success: false
      },
      { status: 500 }
    );
  }
}
