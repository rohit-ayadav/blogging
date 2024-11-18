self.addEventListener('push', function (event) {
    const payload = event.data?.json() ?? {};
    const options = {
        title: payload.title || 'New Notification',
        body: payload.message,
        icon: payload.icon || '/icon.png',
        image: payload.image,
        badge: payload.badge,
        tag: payload.tag,
        timestamp: payload.timestamp || Date.now(),
        vibrate: payload.vibrate ? [200, 100, 200] : undefined,
        renotify: payload.renotify || false,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        actions: payload.actions || [],
        data: payload.data || {},
    };

    event.waitUntil(
        self.registration.showNotification(options.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});