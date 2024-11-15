// Original source: api/send-notification/route.ts
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

interface NotificationResult {
  success: boolean;
  subscription: webpush.PushSubscription;
  error?: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { title, message } = await req.json();

  // Input validation
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
  // Auth checks commented out as per original code
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
    const results: NotificationResult[] = [];

    // Send notifications concurrently
    const notificationPromises = subscriptions.map(async ({ subscription }) => {
      try {
        await webpush.sendNotification(subscription, payload);
        results.push({ success: true, subscription });
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({
          success: false,
          subscription,
          error: errorMessage
        });
        return false;
      }
    });

    await Promise.all(notificationPromises);

    // Calculate statistics
    const totalDevices = results.length;
    const successfulDeliveries = results.filter((r) => r.success).length;
    const failedDeliveries = results.filter((r) => !r.success).length;

    // Group errors by type for analysis
    const errorTypes = results
      .filter((r) => !r.success)
      .reduce<Record<string, number>>((acc, curr) => {
        const errorType = curr.error || "Unknown error";
        acc[errorType] = (acc[errorType] || 0) + 1;
        return acc;
      }, {});

    return NextResponse.json({
      message: "Notifications processed",
      success: true,
      statistics: {
        totalDevices,
        successfulDeliveries,
        failedDeliveries,
        deliveryRate: `${((successfulDeliveries / totalDevices) * 100).toFixed(
          1
        )}%`,
        errorBreakdown: errorTypes
      },
      // Include detailed results for debugging if needed
      details: results.map((r) => ({
        success: r.success,
        endpoint: r.subscription.endpoint,
        error: r.error
      }))
    });
  } catch (error) {
    console.error("Fatal error in notification processing:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: `Error processing notifications: ${errorMessage}`,
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
