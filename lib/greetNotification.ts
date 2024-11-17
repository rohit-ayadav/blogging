async function sendTestNotification(subscription: PushSubscription) {
  const defaultIcon = "/icons/icon-512x512.png";
  const defaultBadge = "/icons/badge.png";

  try {
    const payload = {
      title: "Welcome! 👋",
      message:
        "Your notifications are now set up successfully. Click to explore more.",
      subscription,
      icon: defaultIcon,
      badge: defaultBadge,
      tag: "welcome",
      timestamp: Date.now(),
      vibrate: [200, 100, 200],
      requireInteraction: true, // Makes notification stay until user interacts
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
      url: "/blogs",
      data: {
        type: "welcome",
        timestamp: Date.now()
      },
      ttl: 86400, // 24 hours
      urgency: "normal",
      renotify: false,
      silent: false
    };

    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send notification");
    }

    const result = await response.json();

    if (result.stats.successful > 0) {
      console.log("✅ Welcome notification sent successfully!", {
        deliveryRate: result.stats.successRate,
        deviceCount: result.stats.total,
        timing: result.stats.processingTime
      });
      return {
        success: true,
        ...result.stats
      };
    } else {
      console.warn("⚠️ Notification sent but no active subscribers found", {
        error: "No active subscriptions",
        stats: result.stats
      });
      return {
        success: false,
        error: "No active subscribers found",
        stats: result.stats
      };
    }
  } catch (error) {
    console.error("❌ Failed to send welcome notification:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send notification",
      timestamp: Date.now()
    };
  }
}

async function myFirstNotification(subscription: PushSubscription) {
  try {
    const result = await sendTestNotification(subscription);

    if (result.success) {
      showToast({
        type: "success",
        message: `Notifications enabled! Delivered to ${result.successful} devices`
      });
    } else {
      showToast({
        type: "warning",
        message: result.error || "Couldn't send test notification"
      });
    }
  } catch (error) {
    showToast({
      type: "error",
      message: "Failed to enable notifications"
    });
  }
}

function showToast({ type, message }: { type: string; message: string }) {
  console.log(`${type}: ${message}`);
}

export { myFirstNotification, sendTestNotification, showToast };
