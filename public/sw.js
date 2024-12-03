// Utility function to validate URLs
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
    '/logo.png',
    '/founder.jpg',
    '/manifest.json',
    '/offline.html',
    '/default-profile.jpg',
    '/default-thumbnail.png',
    '/blog.jpeg',
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    './icons/favicon-96x96.png',
    '/icons/create-96x96.png',
    '/contacts',
    '/privacy',
    '/signup',
    '/login',
    '/footer',
    '/services',
    '/tos',
    '/profile',
    '/dashboard',
    '/blogs',
    '/blogs/[id]',
    '/blogs/[slug]',
    '/create',
    '/edit/[id]',
    '/settings',
    '/signup',
    '/login',
    '/edit',
    '/create',
].map(path => new URL(path, self.location.origin).pathname);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('Error during service worker installation:', error);
                throw error;
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        return new Response('Network error happened', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' },
                        });
                    });
            })
    );
});

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
            self.registration.showNotification(options.title, options)
                .catch(error => {
                    console.error('Error showing notification:', error);
                })
        );
    } catch (error) {
        console.error('Error processing push notification:', error);
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    const url = event.notification.data?.url || event.url || '/';
    if (!isValidUrl(url)) {
        console.warn('Invalid URL in notification:', url);
        return;
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
        setting: () => clients.openWindow('/settings'),
        config: () => clients.openWindow('/settings'),
        configure: () => clients.openWindow('/settings'),
        profile: () => clients.openWindow('/profile'),
        explore: () => clients.openWindow('/'),
        discover: () => clients.openWindow('/'),
        search: () => clients.openWindow('/'),
        find: () => clients.openWindow('/')
    };

    if (event.action && actionMap[event.action]) {
        event.waitUntil(actionMap[event.action]());
    } else {
        event.waitUntil(clients.openWindow(url));
    }
    event.waitUntil(clients.openWindow(url));
});