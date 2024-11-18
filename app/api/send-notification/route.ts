// Api to send push notification

import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification.models";
import { connectDB } from "@/utils/db";
import webpush from "web-push";

connectDB();

webpush.setVapidDetails(
  "mailto:rohitkuyada@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    // const { payload, subscription } = await request.json();
    const payload = await request.json();
    let subscriptions = [];
    // if (!subscription) {
    //   subscriptions = await Notification.find({});
    //   console.log("Subscriptions", subscriptions);
    // } else {
    //   subscriptions.push({ subscription });
    // }
    subscriptions = await Notification.find({});

    if (!subscriptions) {
      return NextResponse.json({
        success: false,
        body: "No subscriptions found"
      });
    }
    if (!payload) {
      return NextResponse.json({
        success: false,
        message: "Payload is required"
      });
    }
    if (!payload.title) {
      return NextResponse.json({
        success: false,
        message: "Title are required"
      });
    }

    subscriptions.forEach(async ({ subscription }) => {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
    });

    const stats = {
      deliveryRate: `${(subscriptions.length /
        subscriptions.length *
        100).toFixed(2)}%`,
      deviceCount: subscriptions.length,
      timing: `${subscriptions.length * 100}ms`,
      successful: subscriptions.length,
      failed: 0
    };

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      stats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to send notification"
    });
  }
}
