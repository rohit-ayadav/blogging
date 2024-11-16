import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import Notification from "@/models/notification.models";
import { connectDB } from "@/utils/db";
import { getSessionAtHome } from "@/auth";
import { z } from "zod";

connectDB();

webpush.setVapidDetails(
  "mailto:rohitkuyada@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

// Validation schema for notification action
const NotificationActionSchema = z.object({
  action: z.string(),
  title: z.string()
});

const NotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  image: z.string().url().optional(),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  tag: z.string().optional(),
  timestamp: z.number().optional(),
  vibrate: z.boolean().optional(),
  renotify: z.boolean().optional(),
  requireInteraction: z.boolean().optional(),
  silent: z.boolean().optional(),
  actions: z.array(NotificationActionSchema).optional(),
  url: z.string().url().optional(),
  data: z.record(z.any()).optional(),
  ttl: z.number().min(0).optional(), // Time To Live in seconds
  urgency: z.enum(["very-low", "low", "normal", "high"]).optional(),
  topic: z.string().optional()
});

interface NotificationResult {
  success: boolean;
  subscription: webpush.PushSubscription;
  error?: string;
  timestamp: number;
  endpoint: string;
}

// Rate limiting implementation
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_NOTIFICATIONS_PER_WINDOW = 100;
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= MAX_NOTIFICATIONS_PER_WINDOW) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Authentication
    const session = await getSessionAtHome();
    if (!session) {
      return NextResponse.json(
        { message: "Not authorized", success: false },
        { status: 401 }
      );
    }

    // 2. Rate Limiting
    // if (!checkRateLimit(session?.user?.id)) {
    //   return NextResponse.json(
    //     { message: "Rate limit exceeded", success: false },
    //     { status: 429 }
    //   );
    // }

    // 3. Payload Validation
    const rawData = await req.json();
    const validationResult = NotificationSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid notification data",
          errors: validationResult.error.issues,
          success: false
        },
        { status: 400 }
      );
    }

    const notificationData = validationResult.data;

    // 4. Prepare Notification Payload
    const payload = JSON.stringify({
      body: notificationData.message,
      ...notificationData
    });

    // 5. Get Active Subscriptions
    const subscriptions = await Notification.find({});

    if (!subscriptions.length) {
      return NextResponse.json(
        { message: "No active subscriptions found", success: false },
        { status: 404 }
      );
    }

    // 6. Send Notifications
    const results: NotificationResult[] = [];
    const notificationPromises = subscriptions.map(
      async ({ subscription, _id }) => {
        try {
          const options: webpush.RequestOptions = {
            TTL: notificationData.ttl || 24 * 60 * 60, // Default 24 hours
            urgency: notificationData.urgency || "normal",
            topic: notificationData.topic
          };

          await webpush.sendNotification(subscription, payload, options);

          await Notification.findByIdAndUpdate(_id, {
            lastSuccess: new Date(),
            $inc: { successCount: 1 }, 
          });

          results.push({
            success: true,
            subscription,
            endpoint: subscription.endpoint,
            timestamp: Date.now()
          });

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

            if (
              error instanceof webpush.WebPushError &&
              error.statusCode === 410
            ) {
              // Mark the subscription as inactive if it's expired or invalid
              await Notification.findByIdAndUpdate(_id, { active: false });
            } else {
              // Handle other errors by recording the failure timestamp and incrementing failure count
              await Notification.findByIdAndUpdate(_id, {
                lastFailure: new Date(),
                $inc: { failureCount: 1 }, // Corrected $inc usage
              });
            }
            
          results.push({
            success: false,
            subscription,
            error: errorMessage,
            endpoint: subscription.endpoint,
            timestamp: Date.now()
          });

          return false;
        }
      }
    );

    await Promise.all(notificationPromises);

    // 7. Calculate Statistics and Generate Report
    const totalDevices = results.length;
    const successfulDeliveries = results.filter((r) => r.success).length;
    const failedDeliveries = totalDevices - successfulDeliveries;

    const errorTypes = results
      .filter((r) => !r.success)
      .reduce<Record<string, { count: number; endpoints: string[] }>>(
        (acc, curr) => {
          const errorType = curr.error || "Unknown error";
          if (!acc[errorType]) {
            acc[errorType] = { count: 0, endpoints: [] };
          }
          acc[errorType].count++;
          acc[errorType].endpoints.push(curr.endpoint);
          return acc;
        },
        {}
      );

    const processingTime = Date.now() - startTime;

    // 8. Return Detailed Response
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
        processingTime: `${processingTime}ms`,
        errorBreakdown: errorTypes
      },
      details: results.map((r) => ({
        success: r.success,
        endpoint: r.endpoint,
        error: r.error,
        timestamp: r.timestamp
      })),
      metadata: {
        sender: session?.user?.name || "Unknown",
        timestamp: new Date().toISOString(),
        notificationType: notificationData.tag || "default"
      }
    });
  } catch (error) {
    console.error("Fatal error in notification processing:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: `Error processing notifications: ${errorMessage}`,
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSessionAtHome();

  // if (!session) {
  //   return NextResponse.json(
  //     { message: "Not authorized", success: false },
  //     { status: 401 }
  //   );
  // }

  try {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          totalSubscriptions: { $sum: 1 },
          activeSubscriptions: {
            $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] }
          },
          totalSuccesses: { $sum: "$successCount" },
          totalFailures: { $sum: "$failureCount" },
          averageSuccessRate: {
            $avg: {
              $divide: [
                "$successCount",
                { $add: ["$successCount", "$failureCount"] }
              ]
            }
          }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      statistics: stats[0] || {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        totalSuccesses: 0,
        totalFailures: 0,
        averageSuccessRate: 0
      }
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching statistics", success: false },
      { status: 500 }
    );
  }
}
