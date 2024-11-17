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

type NotificationPayload = {
  title: string;
  message: string;
  userId?: string; // Added for user targeting
  subscription?: any | any[];
  image?: string | null;
  icon?: string | null;
  badge?: string | null;
  tag?: string;
  timestamp?: number;
  vibrate?: boolean;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: any[];
  url?: string | null;
  data?: any;
  ttl?: number;
  urgency?: string;
  topic?: string | null;
};

async function getSubscriptions(payload: NotificationPayload) {
  if (payload.subscription) {
    return Array.isArray(payload.subscription)
      ? payload.subscription.map(sub => ({ subscription: sub }))
      : [{ subscription: payload.subscription }];
  }

  let query = { active: true };

  const subscriptions = await Notification.find(query);

  if (!subscriptions.length) {
    throw new Error(
      payload.userId
        ? `No active subscriptions found for user ${payload.userId}`
        : "No active subscriptions found"
    );
  }

  return subscriptions;
}

async function sendNotification(
  subscription: any,
  notification: NotificationPayload
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ body: notification.message, ...notification }),
      {
        TTL: notification.ttl || 86400,
        urgency: (notification.urgency as webpush.Urgency) || "normal",
        topic: notification.topic || undefined
      }
    );
    return { success: true, endpoint: subscription.endpoint };
  } catch (error) {
    if (error instanceof webpush.WebPushError && error.statusCode === 410) {
      throw { type: "EXPIRED", endpoint: subscription.endpoint };
    }
    throw { type: "FAILED", endpoint: subscription.endpoint, error };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getSessionAtHome();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const data: NotificationPayload = await req.json();

    // Validation
    if (!data.title || !data.message) {
      return NextResponse.json(
        { message: "Title and message are required", success: false },
        { status: 400 }
      );
    }

    const notification: NotificationPayload = {
      title: data.title,
      message: data.message,
      userId: data.userId,
      image: data.image || null,
      icon: data.icon || null,
      badge: data.badge || null,
      tag: data.tag || "default",
      timestamp: data.timestamp || Date.now(),
      vibrate: data.vibrate || false,
      renotify: data.renotify || false,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      actions: data.actions || [],
      url: data.url || null,
      data: data.data || {},
      ttl: data.ttl || 86400,
      urgency: data.urgency || "normal",
      topic: data.topic || null
    };

    // Get subscriptions based on targeting
    const subscriptions = await getSubscriptions(notification);

    const startTime = Date.now();
    const results = [];

    for (const { subscription, _id } of subscriptions) {
      try {
        const result = await sendNotification(subscription, notification);
        results.push(result);

        if (_id) {
          await Notification.findByIdAndUpdate(_id, {
            lastSuccess: new Date(),
            $inc: { successCount: 1 }
          });
        }
      } catch (error) {
        if ((error as any).type === "EXPIRED" && _id) {
          await Notification.findByIdAndUpdate(_id, { active: false });
        } else if (_id) {
          await Notification.findByIdAndUpdate(_id, {
            lastFailure: new Date(),
            $inc: { failureCount: 1 }
          });
        }

        results.push({
          success: false,
          endpoint: (error as any).endpoint,
          error:
            (error as any).error instanceof Error
              ? (error as any).error.message
              : "Unknown error"
        });
      }
    }

    // Calculate stats
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      stats: {
        total: results.length,
        successful,
        failed,
        successRate: `${(successful / results.length * 100).toFixed(1)}%`,
        processingTime: `${Date.now() - startTime}ms`
      },
      results
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Server error",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] } },
          successes: { $sum: "$successCount" },
          failures: { $sum: "$failureCount" }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      successes: 0,
      failures: 0
    };

    return NextResponse.json({
      success: true,
      stats: {
        ...result,
        successRate:
          result.successes + result.failures > 0
            ? `${(result.successes /
                (result.successes + result.failures) *
                100).toFixed(1)}%`
            : "0%"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch stats",
        success: false
      },
      { status: 500 }
    );
  }
}
