// hooks/usePushNotifications.ts
import { useState, useCallback } from "react";

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  errors: Error | null;
}

interface NotificationPayload {
  title: string;
  message: string;
  image?: string;
  url?: string;
}

class PushNotificationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "PushNotificationError";
  }
}

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
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
};

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    subscription: null,
    errors: null
  });

  // Check if push notifications are supported
  const checkSupport = useCallback((): boolean => {
    const isSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setState(prev => ({ ...prev, isSupported }));
    return isSupported;
  }, []);

  // Get existing service worker registration
  const getExistingServiceWorker = useCallback(async () => {
    try {
      return await navigator.serviceWorker.getRegistration("/sw.js");
    } catch (errors) {
      throw new PushNotificationError(
        "Failed to get service worker registration",
        "SW_REGISTRATION_FAILED"
      );
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });
      await navigator.serviceWorker.ready;
      return registration;
    } catch (errors) {
      throw new PushNotificationError(
        "Failed to register service worker",
        "SW_REGISTRATION_FAILED"
      );
    }
  }, []);

  // Get VAPID key and create subscription
  const createPushSubscription = useCallback(
    async (registration: ServiceWorkerRegistration) => {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new PushNotificationError(
          "VAPID public key not configured",
          "VAPID_KEY_MISSING"
        );
      }

      try {
        return await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      } catch (errors) {
        throw new PushNotificationError(
          "Failed to create push subscription",
          "SUBSCRIPTION_FAILED"
        );
      }
    },
    []
  );

  // Send subscription to server
  const sendSubscriptionToServer = useCallback(
    async (subscription: PushSubscription) => {
      try {
        const response = await fetch("/api/subscribe-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          const errors = await response.json();
          throw new Error(errors.message);
        }

        return await response.json();
      } catch (errors) {
        throw new PushNotificationError(
          "Failed to save subscription on server",
          "SERVER_SUBSCRIPTION_FAILED"
        );
      }
    },
    []
  );

  // Subscribe to push notifications
  const subscribe = useCallback(
    async () => {
      try {
        if (!checkSupport()) {
          throw new PushNotificationError(
            "Push notifications are not supported",
            "NOT_SUPPORTED"
          );
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new PushNotificationError(
            "Notification permission denied",
            "PERMISSION_DENIED"
          );
        }

        let registration = await getExistingServiceWorker();
        if (!registration) {
          registration = await registerServiceWorker();
        }

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await createPushSubscription(registration);
        }

        await sendSubscriptionToServer(subscription);

        setState(prev => ({
          ...prev,
          isSubscribed: true,
          subscription,
          errors: null
        }));

        return subscription;
      } catch (errors) {
        setState(prev => ({
          ...prev,
          errors: errors instanceof Error ? errors : new Error("Unknown errors")
        }));
        throw errors;
      }
    },
    [
      checkSupport,
      getExistingServiceWorker,
      registerServiceWorker,
      createPushSubscription,
      sendSubscriptionToServer
    ]
  );

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(
    async () => {
      try {
        const registration = await getExistingServiceWorker();
        if (!registration) {
          throw new PushNotificationError(
            "No service worker registration found",
            "NO_REGISTRATION"
          );
        }

        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await fetch("/api/unsubscribe-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription })
          });
        }

        setState(prev => ({
          ...prev,
          isSubscribed: false,
          subscription: null,
          errors: null
        }));
      } catch (errors) {
        setState(prev => ({
          ...prev,
          errors: errors instanceof Error ? errors : new Error("Unknown errors")
        }));
        throw errors;
      }
    },
    [getExistingServiceWorker]
  );

  // Send a notification
  const sendNotification = useCallback(
    async (payload: NotificationPayload) => {
      if (!state.subscription) {
        throw new PushNotificationError(
          "No active subscription found",
          "NO_SUBSCRIPTION"
        );
      }

      try {
        const response = await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            subscription: state.subscription
          })
        });

        if (!response.ok) {
          const errors = await response.json();
          throw new Error(errors.message);
        }

        return await response.json();
      } catch (errors) {
        throw new PushNotificationError(
          "Failed to send notification",
          "SEND_NOTIFICATION_FAILED"
        );
      }
    },
    [state.subscription]
  );

  return {
    ...state,
    subscribe,
    unsubscribe,
    sendNotification
  };
};
