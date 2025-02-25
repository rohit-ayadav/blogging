// Api to send push notification
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification.models";
import { connectDB } from "@/utils/db";
import webpush from "web-push";

connectDB();
interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface Payload {
  title: string;
  [key: string]: any;
}

const validateSubscription = (subscription: Subscription): boolean => {
  return (
    !!subscription &&
    !!subscription.keys &&
    !!subscription.keys.p256dh &&
    !!subscription.keys.auth
  );
};

webpush.setVapidDetails(
  "mailto:rohitkuyada@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

const getSubscriptions = async (subscription?: Subscription) => {
  if (subscription) {
    if (!validateSubscription(subscription)) {
      throw new Error("Invalid subscription");
    }
    return [{ subscription }];
  }

  // const activeSubscriptions = await Notification.find({ active: true });
  const activeSubscriptions = await Notification.find({});
  // delete the subscription having active as false
  await Notification.deleteMany({ active: false });
  if (!activeSubscriptions.length) {
    throw new Error("No subscriptions found");
  }

  return activeSubscriptions;
};

// Send notifications to all subscriptions
const sendNotifications = async (
  subscriptions: { subscription: Subscription }[],
  payload: Payload
) => {
  const success: string[] = [];
  const failed: string[] = [];

  await Promise.all(
    subscriptions.map(async ({ subscription }) => {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        success.push(subscription.endpoint);
      } catch (error) {
        console.error("Failed to send notification:", error);
        failed.push(subscription.endpoint);
      }
    })
  );

  return { success, failed };
};

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { payload, subscription } = await request.json();
    if (!payload) {
      return NextResponse.json(
        { message: "Payload is required", success: false },
        { status: 400 }
      );
    }

    const subscriptions = await getSubscriptions(subscription);
    const { success, failed } = await sendNotifications(subscriptions, payload);

    const stats = {
      total: subscriptions.length,
      successful: success.length,
      failed: failed.length,
      deliveryRate: `${(success.length / subscriptions.length * 100).toFixed(
        2
      )}%`
    };

    // Delete the subscription having active as false
    await Notification.deleteMany({ active: false });
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { message: "Error sending notifications", success: false },
      { status: 500 }
    );
  }
}
