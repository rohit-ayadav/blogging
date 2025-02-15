import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification.models";
import { connectDB } from "@/utils/db";
import { url } from "inspector";

connectDB();

const defaultIcon =
  "https://as1.ftcdn.net/v2/jpg/09/15/85/08/1000_F_915850846_PYB5ChOp6ZVc0KGouKNKicwFNolwd5nZ.jpg";
const defaultBadge = "/favicon.ico";

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
  if (!req.body) {
    return NextResponse.json(
      { message: "Invalid request", success: false },
      { status: 400 }
    );
  }

  const { subscription } = await req.json();

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
    const payload = {
      title: "Welcome! 👋",
      message:
        "Thank you for subscribing to our notifications. You will now receive updates and notifications from our site.",
      icon: defaultIcon,
      badge: defaultBadge,
      tag: "welcome",
      timestamp: Date.now(),
      vibrate: [200, 100, 200],
      requireInteraction: true,
      actions: [
        {
          action: "explore",
          title: "Explore Site"
        },
        {
          action: "settings",
          title: "Notification Settings"
        }
      ],
      data: {
        type: "welcome",
        timestamp: Date.now(),
        url: "/blogs"
      },
      url: "/blogs",
      ttl: 86400, // 24 hours
      urgency: "normal",
      renotify: false,
      silent: false
    };

    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return NextResponse.json({
      message:
        "Notification subscription saved and welcome notification sent successfully",
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
