// Service Worker Configuration
const CONFIG = {
    version: '3.0.0',
    caches: {
        static: 'static-cache-v3',
        dynamic: 'dynamic-cache-v3',
        pages: 'pages-cache-v3',
        images: 'images-cache-v3',
        api: 'api-cache-v3'
    },
    strategies: {
        api: {
            timeout: 3000,
            maxAge: 5 * 60 * 1000 // 5 minutes
        },
        images: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
    }
};

const STATIC_ASSETS = [
    '/offline',
    '/login',
    '/create',
    '/manifest.json',
    '/css/main.css',
    '/js/app.js',
    '/icons/android-icon-192x192.png',
    '/icons/android-icon-72x72.png',
    '/icons/favicon.ico',
    '/default-thumbnail.png'
];

// Cache management helper class
class CacheManager {
    static async deleteOldCaches() {
        const cacheNames = await caches.keys();
        const validCaches = Object.values(CONFIG.caches);

        return Promise.all(
            cacheNames
                .filter(name => !validCaches.includes(name))
                .map(name => {
                    console.log(`Deleting old cache: ${name}`);
                    return caches.delete(name);
                })
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

        const metadata = response.headers.get('sw-cache-metadata');
        if (!metadata) return true;

        const { timestamp, ttl } = JSON.parse(metadata);
        return Date.now() - timestamp < ttl;
    }
}

// Request handler class
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
            console.error('API request failed:', error);
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
            console.error('Image fetch failed:', error);
            return cache.match('/default-thumbnail.png');
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
            const cache = await caches.open(CONFIG.caches.pages);
            const cachedResponse = await cache.match(event.request);
            return cachedResponse || cache.match('/offline');
        }
    }
}

// Push Notification Handler class
class NotificationHandler {
    static async handlePush(event) {
        if (!event.data) return;

        try {
            const data = event.data.json();
            const options = this.createNotificationOptions(data);

            await self.registration.showNotification(data.title || 'New Update', options);
        } catch (error) {
            console.error('Push notification error:', error);
            await this.showFallbackNotification();
        }
    }

    static createNotificationOptions(data) {
        return {
            body: data.body,
            icon: data.icon || '/icons/android-icon-192x192.png',
            badge: '/icons/android-icon-72x72.png',
            image: data.image,
            vibrate: [100, 50, 100],
            tag: data.tag || 'default',
            data: {
                url: data.url || '/dashboard',
                timestamp: Date.now(),
                ...data.data
            },
            actions: [
                { action: 'open', title: '📱 Open' },
                { action: 'close', title: '❌ Dismiss' }
            ],
            requireInteraction: data.requireInteraction || false,
            renotify: data.renotify || false,
            silent: data.silent || false
        };
    }

    static async showFallbackNotification() {
        await self.registration.showNotification('New Update', {
            body: 'Check your application for updates',
            icon: '/icons/android-icon-192x192.png'
        });
    }

    static async handleNotificationClick(event) {
        event.notification.close();

        const urlToOpen = event.notification.data?.url || '/dashboard';

        const windowClients = await clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        });

        const existingClient = windowClients.find(client =>
            client.url === urlToOpen || client.url.endsWith(urlToOpen)
        );

        if (existingClient) {
            return existingClient.focus();
        }

        if (event.action === 'close') return;

        return clients.openWindow(urlToOpen);
    }
}

// Event Listeners
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CONFIG.caches.static)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
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
    if (event.request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
        return;
    }

    if (RequestHandler.isApiRequest(url.pathname)) {
        event.respondWith(RequestHandler.handleAPIRequest(event));
    } else if (RequestHandler.isImageRequest(url.pathname)) {
        event.respondWith(RequestHandler.handleImageRequest(event));
    } else if (RequestHandler.isHTMLRequest(event.request)) {
        event.respondWith(RequestHandler.handleHTMLRequest(event));
    } else {
        // Default Stale-While-Revalidate strategy for other assets
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
                return fetch('/api/update-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subscription)
                });
            })
    );
});