// hooks/push-client.ts
"use client";
import { useEffect, useCallback, useState } from "react";

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
      console.log("Registering Service Worker...");
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });
      console.log("Service Worker registered successfully:", registration);
      await navigator.serviceWorker.ready;
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
      registration = await registerServiceWorker();
    } else if ("serviceWorker" in navigator) {
      // Check if service worker is already registered
      registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await registerServiceWorker();
      }
    }

    if (!registration) throw new Error("ServiceWorker registration failed");

    const permission = await Notification.requestPermission();

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

    const response = await fetch("/api/subscribe-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subscription,
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
  } catch (error) {
    console.error("Push notification setup failed:", error);
    throw error;
  }
}

const isAlreadySubscribedForPushNotifications = async () => {
  if (!isNotificationSupported()) {
    console.warn("Push notifications not supported");
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.error("Failed to check push subscription:", error);
    return false;
  }
};

export function usePushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    isAlreadySubscribedForPushNotifications().then(setIsSubscribed);
  }, []);

  return { isSubscribed };
}

export function usePushClient() {
  const initializePush = useCallback(() => {
    enablePushNotifications().catch(error => {
      console.error("Failed to enable push notifications:", error);
    });
  }, []);

  return { initializePush };
}

const registerServiceWorkerFirstTime = async () => {
  let registration;
  if (process.env.NODE_ENV === "development") {
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      await existingRegistration.unregister();
    }
    registration = await registerServiceWorker();
  } else if ("serviceWorker" in navigator) {
    // Check if service worker is already registered
    registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await registerServiceWorker();
    }
  }
};

export { registerServiceWorkerFirstTime };