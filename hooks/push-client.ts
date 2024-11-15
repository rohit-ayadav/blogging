// hooks/push-client.ts
import { useEffect, useCallback } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
    // First unregister any existing service worker to ensure clean slate
    const existingRegistration =
      await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      await existingRegistration.unregister();
    }

    // Register new service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    console.log("ServiceWorker registered successfully:", registration);

    // Request permission with better error handling
    const permission = await Notification.requestPermission();
    console.log("Notification permission status:", permission);

    if (permission !== "granted") {
      throw new Error(`Permission not granted for Notification: ${permission}`);
    }

    // Get existing subscription or create new one
    subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log("Found existing push subscription", subscription);
    } else {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("VAPID public key not found");
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log("Created new push subscription", subscription);
    }

    // Send subscription to server
    const response = await fetch("/api/subscribe-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subscription,
        // Add additional debugging info
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${errorData.message}`);
    }

    const data = await response.json();
    console.log("Server subscription response:", data);

    // Test notification
    await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Thanks for subscribing!",
        message: "You will now receive notifications for new posts.",
        image: "/icons/android-chrome-192x192.png",
        url: "/blogs",
        subscription: data.subscription
      })
    });
    console.log("Test notification sent successfully");
  } catch (error) {
    console.error("Push notification setup failed:", error);
    // Re-throw to handle in component
    throw error;
  }
}

export function usePushClient() {
  const initializePush = useCallback(async () => {
    if (!isNotificationSupported()) {
      throw new Error("Push notifications are not supported in this browser");
    }

    try {
      await enablePushNotifications();
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    initializePush().catch((error) => {
      console.error("Push initialization failed in useEffect:", error);
    });
  }, [initializePush]);

  // Return the initialization function so it can be called manually if needed
  return { initializePush };
}
