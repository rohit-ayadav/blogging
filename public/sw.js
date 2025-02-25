// Utility function to validate URLs
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function convertToAbsoluteUrl(url) {
    const baseUrl = "https://www.devblogger.in";
    url = url.trim();

    if (/^(?:[a-zA-Z][a-zA-Z\d+\-.]*):/.test(url)) {
        return url;
    }
    return new URL(url, baseUrl).href;
}

self.addEventListener('push', event => {
    try {
        const payload = event.data?.json() ?? {};
        const options = {
            title: payload.title || 'New Notification',
            body: payload.message || 'You have a new notification',
            icon: payload.icon || 'https://as1.ftcdn.net/v2/jpg/09/15/85/08/1000_F_915850846_PYB5ChOp6ZVc0KGouKNKicwFNolwd5nZ.jpg',
            image: payload.image,
            badge: payload.badge || '/icon.png',
            tag: payload.tag || 'default',
            data: {
                url: payload.url,
                ...payload.data
            },
            timestamp: payload.timestamp || Date.now(),
            vibrate: payload.vibrate ? [200, 100, 200] : undefined,
            renotify: Boolean(payload.renotify),
            requireInteraction: Boolean(payload.requireInteraction),
            silent: Boolean(payload.silent),
            actions: Array.isArray(payload.actions) ? payload.actions : []
        };

        event.waitUntil(
            (async () => {
                try {
                    await self.registration.showNotification(options.title, options);
                } catch (error) {
                    console.error('Error showing notification:', error);
                }
            })()
        );
    } catch (error) {
        console.error('Error processing push notification:', error);
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    console.log('Notification clicked:', event.notification.data);

    let url = event.notification.data?.url || 'https://www.devblogger.in/';

    if (!isValidUrl(url)) {
        url = convertToAbsoluteUrl(url);
    }
    
    // if url contains like "/blog" then parse it to canonical url.
    if (!url.startsWith('http')) {
        url = `${self.location.origin}${url}`;
    }

    const actionMap = {
        dismiss: () => { },
        close: () => { },
        cancel: () => { },
        open: () => clients.openWindow(url),
        view: () => clients.openWindow(url),
        read: () => clients.openWindow(url),
        show: () => clients.openWindow(url),
        settings: () => clients.openWindow('/settings'),
        config: () => clients.openWindow('/settings'),
        profile: () => clients.openWindow('/profile'),
        explore: () => clients.openWindow('/'),
        discover: () => clients.openWindow('/'),
        search: () => clients.openWindow('/'),
        find: () => clients.openWindow('/'),
        home: () => clients.openWindow('/'),
        dashboard: () => clients.openWindow('/profile'),
        admin: () => clients.openWindow('/admin'),
    };

    if (event.action && actionMap[event.action]) {
        console.log('Executing action:', event.action);
        event.waitUntil(actionMap[event.action]());
    } else if (clients.openWindow) {
        event.waitUntil(clients.openWindow(url));
    }
});