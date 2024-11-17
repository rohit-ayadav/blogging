// hooks/push-client.ts
import { useEffect, useCallback, useRef } from "react";
import {
  myFirstNotification,
  sendTestNotification
} from "../lib/greetNotification";

function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) {
    return new Uint8Array();
  }

  const padding = "=".repeat((4 - base64String.length % 4) % 4);
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

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      console.time("SW-registration");

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });

      console.timeEnd("SW-registration");

      // Set a timeout for the ready check
      const readyPromise = Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SW ready timeout")), 15000)
        )
      ]);

      await readyPromise;
      console.log("Service Worker is ready");

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw error;
    }
  }
}

async function enablePushNotifications() {
  let subscription, registration;
  try {
    if (process.env.NODE_ENV === "development") {
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        await existingRegistration.unregister();
      }
      console.log("ServiceWorker unregistered successfully");
      registration = await registerServiceWorker();
      console.log("ServiceWorker registered successfully:", registration);
    } else if ("serviceWorker" in navigator) {
      registration = await registerServiceWorker();
      console.log("ServiceWorker registered successfully:", registration);
    }

    if (!registration) {
      throw new Error("ServiceWorker registration failed");
    } else {
      console.log("ServiceWorker registered successfully:");
    }

    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Notification permission status:", permission);

    if (permission !== "granted") {
      throw new Error("Permission denied for Notification");
    } else {
      console.log("Permission granted for Notification: ", permission);
    }

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
    console.log("Sending test notification..." + subscription);
    // check if subscription is valid
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    await myFirstNotification(subscription);
    await sendTestNotification(subscription);
  } catch (error) {
    console.error("Push notification setup failed:", error);
    throw error;
  }
}

export function usePushClient() {
  const initializePush = useCallback(async () => {
    if (!isNotificationSupported()) {
      console.warn("Push notifications not supported");
      return;
    }

    try {
      await enablePushNotifications();
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(
    () => {
      initializePush().catch(error => {
        console.error("Push initialization failed in useEffect:", error);
      });
    },
    [initializePush]
  );
  return { initializePush };
}
