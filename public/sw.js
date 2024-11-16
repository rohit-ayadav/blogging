// Configuration
const CONFIG = {
    version: '1.0.0',
    caches: {
        static: 'static-cache-v1',
        dynamic: 'dynamic-cache-v1',
        pages: 'pages-cache-v1',
        images: 'images-cache-v1',
        api: 'api-cache-v1'
    },
    strategies: {
        api: {
            timeout: 5000,
            maxAge: 10 * 60 * 1000 // 10 minutes
        },
        images: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
    }
};

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/about',
    '/contacts',
    '/services',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    '/icons/android-icon-192x192.png',
    '/icons/android-icon-512x512.png'
];

// Cache Management
class CacheManager {
    static async deleteOldCaches() {
        const cacheNames = await caches.keys();
        const validCaches = Object.values(CONFIG.caches);

        return Promise.all(
            cacheNames
                .filter(name => !validCaches.includes(name))
                .map(name => caches.delete(name))
        );
    }

    static async limitCacheSize(cacheName, maxItems) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        if (keys.length > maxItems) {
            await Promise.all(
                keys.slice(0, keys.length - maxItems).map(key => cache.delete(key))
            );
        }
    }

    static async cacheWithExpiry(cacheName, request, response) {
        const cache = await caches.open(cacheName);
        const now = Date.now();
        const clonedResponse = response.clone();

        const metadata = {
            url: request.url,
            timestamp: now,
            ttl: CONFIG.strategies.api.maxAge
        };

        const modifiedResponse = new Response(clonedResponse.body, {
            ...clonedResponse,
            headers: new Headers({
                ...Object.fromEntries(clonedResponse.headers.entries()),
                'sw-cache-metadata': JSON.stringify(metadata)
            })
        });

        await cache.put(request, modifiedResponse);
    }

    static async isResponseValid(response) {
        if (!response) return false;

        try {
            const metadata = response.headers.get('sw-cache-metadata');
            if (!metadata) return true;

            const { timestamp, ttl } = JSON.parse(metadata);
            return Date.now() - timestamp < ttl;
        } catch {
            return false;
        }
    }
}

// Request Handling
class RequestHandler {
    static isApiRequest(url) {
        return url.includes('/api/') || url.includes('/graphql');
    }

    static isImageRequest(url) {
        return url.match(/\.(jpe?g|png|gif|svg|webp|avif)$/i);
    }

    static isHTMLRequest(request) {
        return request.mode === 'navigate' ||
            request.headers.get('accept')?.includes('text/html');
    }

    static async handleAPIRequest(event) {
        try {
            const networkPromise = fetch(event.request.clone());
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Network timeout')), CONFIG.strategies.api.timeout)
            );

            const response = await Promise.race([networkPromise, timeoutPromise]);

            if (response.ok) {
                await CacheManager.cacheWithExpiry(CONFIG.caches.api, event.request, response.clone());
                return response;
            }
            throw new Error('Network response was not ok');
        } catch (error) {
            const cachedResponse = await caches.match(event.request);

            if (await CacheManager.isResponseValid(cachedResponse)) {
                return cachedResponse;
            }

            return Response.json(
                { error: 'Network error, please try again later' },
                { status: 503 }
            );
        }
    }

    static async handleImageRequest(event) {
        const cache = await caches.open(CONFIG.caches.images);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            return cachedResponse;
        }

        try {
            const response = await fetch(event.request);
            if (response.ok) {
                await cache.put(event.request, response.clone());
                await CacheManager.limitCacheSize(
                    CONFIG.caches.images,
                    CONFIG.strategies.images.maxEntries
                );
                return response;
            }
            throw new Error('Network response was not ok');
        } catch (error) {
            return cache.match('/icons/default-image.png');
        }
    }

    static async handleHTMLRequest(event) {
        try {
            const response = await fetch(event.request);
            if (response.ok) {
                const cache = await caches.open(CONFIG.caches.pages);
                await cache.put(event.request, response.clone());
                return response;
            }
            throw new Error('Network response was not ok');
        } catch (error) {
            const cachedResponse = await caches.match(event.request);
            return cachedResponse || caches.match('/offline');
        }
    }
}

// Notification Handler
class NotificationHandler {
    static async handlePush(event) {
        if (!event.data) return;

        try {
            const data = event.data.json();
            const options = this.createNotificationOptions(data);

            await self.registration.showNotification(data.title, options);
        } catch (error) {
            console.error('Push notification error:', error);
            await this.showFallbackNotification();
        }
    }

    static createNotificationOptions(data) {
        return {
            body: data.message,
            icon: data.icon || '/icons/android-icon-192x192.png',
            badge: data.badge || '/icons/android-icon-72x72.png',
            image: data.image,
            tag: data.tag || 'default',
            timestamp: data.timestamp || Date.now(),
            vibrate: data.vibrate ? [100, 50, 100] : undefined,
            renotify: data.renotify || false,
            requireInteraction: data.requireInteraction || false,
            silent: data.silent || false,
            actions: data.actions || [
                { action: 'open', title: '📱 Open' },
                { action: 'close', title: '❌ Dismiss' }
            ],
            data: {
                url: data.url || '/',
                ttl: data.ttl || 86400,
                urgency: data.urgency || 'normal',
                topic: data.topic,
                ...data.data
            }
        };
    }

    static async showFallbackNotification() {
        await self.registration.showNotification('New Update', {
            body: 'There\'s new content available.',
            icon: '/icons/android-icon-192x192.png'
        });
    }

    static async handleNotificationClick(event) {
        event.notification.close();

        if (event.action === 'close') return;

        const urlToOpen = event.notification.data?.url || '/';

        const windowClients = await clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        });

        // Focus existing tab if available
        const existingClient = windowClients.find(client =>
            client.url === urlToOpen || client.url.endsWith(urlToOpen)
        );

        if (existingClient) {
            await existingClient.focus();
            return;
        }

        // Open new window/tab
        await clients.openWindow(urlToOpen);
    }
}

// Event Listeners
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CONFIG.caches.static)
                .then(cache => cache.addAll(STATIC_ASSETS)),
            self.skipWaiting()
        ])
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            CacheManager.deleteOldCaches(),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET requests and cross-origin requests
    if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    if (RequestHandler.isApiRequest(url.pathname)) {
        event.respondWith(RequestHandler.handleAPIRequest(event));
    } else if (RequestHandler.isImageRequest(url.pathname)) {
        event.respondWith(RequestHandler.handleImageRequest(event));
    } else if (RequestHandler.isHTMLRequest(event.request)) {
        event.respondWith(RequestHandler.handleHTMLRequest(event));
    } else {
        // Default Stale-While-Revalidate strategy
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    const fetchPromise = fetch(event.request)
                        .then(response => {
                            if (response.ok) {
                                caches.open(CONFIG.caches.dynamic)
                                    .then(cache => cache.put(event.request, response.clone()));
                            }
                            return response;
                        });
                    return cachedResponse || fetchPromise;
                })
        );
    }
});

self.addEventListener('push', event => {
    event.waitUntil(NotificationHandler.handlePush(event));
});

self.addEventListener('notificationclick', event => {
    event.waitUntil(NotificationHandler.handleNotificationClick(event));
});

self.addEventListener('pushsubscriptionchange', event => {
    event.waitUntil(
        self.registration.pushManager.subscribe(event.oldSubscription.options)
            .then(subscription => {
                return fetch('/api/subscribe-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subscription)
                });
            })
    );
});