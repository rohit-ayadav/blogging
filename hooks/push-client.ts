// This code is copied from @Suryansh2002

import { useEffect } from "react";

function isNotificationSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function enablePushNotifications() {
  let subscription;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();

    // if (permission !== "granted") {
    //   console.error("Permission not granted for Notification");
    //   return;
    // }
    if (permission === "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        console.error("Permission not granted for Notification");
        return;
      }
    }

    console.log("Permission granted for Notification");
    subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log("Already subscribed to push notifications");
    } else {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
      });

      console.log("Subscribed to push notifications", subscription);
      if (!subscription) {
        console.error("Subscription not found");
        return;
      }
    }
    const response = await fetch("/api/subscribe-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ subscription })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error subscribing to notifications", data.message);
      return;
    }
    console.log("Subscribed to notifications", data.message);
  } catch (error) {
    console.error("Error subscribing to notifications", error);
  }
}

export function usePushClient() {
  useEffect(() => {
    if (!isNotificationSupported()) {
      console.error("Notification not supported");
      return;
    }
    console.log("Notification supported");
    enablePushNotifications();
  }, [enablePushNotifications]);
}
