// Service Worker for Blog Website
const CACHE_NAME = 'blog-website-v2';
const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';

const STATIC_ASSETS = [
    // '/',  // Add root path
    // '/blogs',
    '/offline',
    // '/dashboard',  // Fixed paths (removed dots)
    '/login',
    '/create',
    // '/dashboard/admin',
    // '/profile',
    // '/default-thumbnail.png',  // Add default image to static assets
    '/icons/android-icon-192x192.png',
    '/icons/android-icon-72x72.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('Failed to cache static assets:', error);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.filter(key => {
                        return key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME;
                    }).map(key => {
                        console.log('Deleting old cache', key);
                        return caches.delete(key);
                    })
                );
            })
            .catch(error => {
                console.error('Failed to delete old caches:', error);
            })
            .then(() => self.clients.claim())
    );
});

// Helper function to check if request is for an API route
const isApiRequest = (url) => {
    return url.includes('/api/');
};

// Helper function to check if request is for an image
const isImageRequest = (url) => {
    return url.match(/\.(jpe?g|png|gif|svg|webp)$/i);  // Added webp and made case insensitive
};

// Helper function to handle network timeout
const timeoutPromise = (ms) => {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
    );
};

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    // API requests - Network First with timeout fallback
    if (isApiRequest(event.request.url)) {
        event.respondWith(
            Promise.race([
                fetch(event.request.clone()),
                timeoutPromise(3000)
            ])
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then(cache => cache.put(event.request, clonedResponse))
                        .catch(error => console.error('Cache put error:', error));
                    return response;
                })
                .catch(async (error) => {
                    console.error('API request failed:', error);
                    const cachedResponse = await caches.match(event.request);
                    return cachedResponse || caches.match('/offline');
                })
        );
        return;
    }

    // Image requests - Cache First with network fallback
    if (isImageRequest(event.request.url)) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) return cachedResponse;

                    return fetch(event.request)
                        .then(response => {
                            if (!response.ok) throw new Error('Network response was not ok');
                            const clonedResponse = response.clone();
                            caches.open(DYNAMIC_CACHE_NAME)
                                .then(cache => cache.put(event.request, clonedResponse))
                                .catch(error => console.error('Cache put error:', error));
                            return response;
                        });
                })
                // .catch(() => {
                //     return caches.match('/default-thumbnail.png');
                // })
        );
        return;
    }

    // HTML pages - Network First with cache fallback
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then(cache => cache.put(event.request, clonedResponse))
                        .catch(error => console.error('Cache put error:', error));
                    return response;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(event.request);
                    return cachedResponse || caches.match('/offline');
                })
        );
        return;
    }

    // Default - Stale While Revalidate
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                const fetchPromise = fetch(event.request)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        const clonedResponse = response.clone();
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(cache => cache.put(event.request, clonedResponse))
                            .catch(error => console.error('Cache put error:', error));
                        return response;
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        return cachedResponse;
                    });

                return cachedResponse || fetchPromise;
            })
    );
});

// Enhanced Push Notification Handling
self.addEventListener('push', (event) => {
    if (!event.data) {
        console.warn('Push event received but no data');
        return;
    }

    try {
        const data = event.data.json();
        if (!data.title) {
            throw new Error('Notification must have a title');
        }

        const defaultOptions = {
            icon: '/icons/android-icon-192x192.png',
            badge: '/icons/android-icon-72x72.png',
            vibrate: [100, 50, 100],
            actions: [
                { action: 'open', title: 'Open App' },
                { action: 'close', title: 'Dismiss' }
            ],
            dir: 'auto',
            timestamp: Date.now()
        };

        const options = {
            ...defaultOptions,
            ...data,
            data: {
                ...data.data,
                url: data.url || '/dashboard',
                image: data.image || '/icons/android-icon-192x192.png'
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
                .catch(error => {
                    console.error('Failed to show notification:', error);
                    // Fallback to basic notification
                    return self.registration.showNotification('New Update', {
                        body: 'Check your application for updates',
                        icon: defaultOptions.icon
                    });
                })
        );
    } catch (error) {
        console.error('Error processing push notification:', error);
        event.waitUntil(
            self.registration.showNotification('New Update', {
                body: 'Check your application for updates',
                icon: '/icons/android-icon-192x192.png'
            })
        );
    }
});

// Enhanced Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const handleAction = () => {
        const action = event.action;
        const data = event.notification.data || {};
        const targetUrl = data.url || '/dashboard';

        switch (action) {
            case 'open':
                return clients.openWindow(targetUrl);
            case 'close':
                return Promise.resolve();
            default:
                return clients.openWindow(targetUrl);
        }
    };

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                const matchingClient = windowClients.find(client =>
                    client.url === event.notification.data?.url
                );

                if (matchingClient) {
                    return matchingClient.focus();
                }
                return handleAction();
            })
            .catch(error => {
                console.error('Error handling notification click:', error);
                return handleAction();
            })
    );
});

// Subscription change handler
self.addEventListener('pushsubscriptionchange', (event) => {
    event.waitUntil(
        self.registration.pushManager.subscribe(event.oldSubscription.options)
            .then((subscription) => {
                return fetch('/api/update-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscription)
                });
            })
            .catch(error => {
                console.error('Failed to update push subscription:', error);
            })
    );
});