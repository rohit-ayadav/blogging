// hooks/push-client.ts
"use client";
import { useEffect, useCallback, useState } from "react";
import { PushSubscriptionRequest } from "@/types/notification-types";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  if (!base64String) {
    console.warn("Empty base64 string provided");
    return new Uint8Array();
  }

  try {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error("Failed to convert base64 string:", error);
    throw new Error("Invalid base64 string provided");
  }
}

function isNotificationSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function registerServiceWorker(): Promise<
  ServiceWorkerRegistration | undefined
> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js?v=3", {
      scope: "/"
    });
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    throw error;
  }
}

async function enablePushNotifications(): Promise<void> {
  if (!isNotificationSupported()) {
    throw new Error("Push notifications not supported in this browser");
  }

  try {
    const registration = await registerServiceWorkerFirstTime();
    if (!registration) throw new Error("ServiceWorker registration failed");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("VAPID public key not found");
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
    }

    const response = await fetch("/api/subscribe-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          subscription,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        } as PushSubscriptionRequest
      )
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Subscription failed: ${errorData.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Push notification setup failed:", error);
    throw error;
  }
}

const isAlreadySubscribedForPushNotifications = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.error("Failed to check push subscription:", error);
    return false;
  }
};

export function usePushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const subscribed = await isAlreadySubscribedForPushNotifications();
        setIsSubscribed(subscribed);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  return { isSubscribed, isLoading, error };
}

export function usePushClient() {
  const [initializationStatus, setInitializationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const initializePush = useCallback(async () => {
    try {
      setInitializationStatus("loading");
      await enablePushNotifications();
      setInitializationStatus("success");
    } catch (error) {
      console.error("Failed to enable push notifications:", error);
      setInitializationStatus("error");
      throw error;
    }
  }, []);

  return { initializePush, initializationStatus };
}

const registerServiceWorkerFirstTime = async (): Promise<
  ServiceWorkerRegistration | undefined
> => {
  if (!("serviceWorker" in navigator)) return;

  try {
    if (process.env.NODE_ENV === "development") {
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        await existingRegistration.unregister();
      }
      return await registerServiceWorker();
    }

    const registration = await navigator.serviceWorker.getRegistration();
    return registration || (await registerServiceWorker());
  } catch (error) {
    console.error("Failed to register service worker:", error);
    throw error;
  }
};

export { registerServiceWorkerFirstTime };
