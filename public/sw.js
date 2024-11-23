function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

const CACHE_NAME = 'v1';
const STATIC_ASSETS = [
    '/about',
    '/contacts',
    '/privacy',
    '/signup',
    '/login',
    '/footer',
    '/services',
    '/tos',
];

// This 
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});


self.addEventListener('push', function (event) {
    const payload = event.data?.json() ?? {};
    const options = {
        title: payload.title || 'New Notification',
        body: payload.message,
        icon: payload.icon || '/icon.png',
        image: payload.image,
        badge: payload.badge,
        tag: payload.tag,
        url: payload.url,
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
    const url = event.notification.data?.url || event.url;
    if (!isValidUrl(url)) {
        return;
    }
    event.waitUntil(
        clients.openWindow(url)
    );
    if (event.action) {
        switch (event.action) {
            case 'dismiss' || 'close' || 'cancel':
                break;
            case 'open' || 'view' || 'read' || 'show':
                event.waitUntil(
                    clients.openWindow(url)
                );
                break;
            case 'settings' || 'setting' || 'config' || 'configure' || 'profile':
                event.waitUntil(
                    clients.openWindow('/profile')
                );
                break;
            case 'explore' || 'discover' || 'search' || 'find':
                event.waitUntil(
                    clients.openWindow('/')
                );

            default:
                break;
        }
    }
});
