const CACHE_NAME = 'blog-website-v1';
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/blogs',
    '/offline',  // Create an offline fallback page
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/styles/globals.css',
    // Add other critical CSS/JS files
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
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
            .then(() => self.clients.claim())
    );
});

// Helper function to check if request is for an API route
const isApiRequest = (url) => {
    return url.includes('/api/');
};

// Helper function to check if request is for an image
const isImageRequest = (url) => {
    return url.match(/\.(jpg|jpeg|png|gif|svg)$/);
};

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    // API requests - Network First with timeout fallback
    if (isApiRequest(event.request.url)) {
        event.respondWith(
            Promise.race([
                fetch(event.request)
                    .then(response => {
                        const clonedResponse = response.clone();
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(cache => cache.put(event.request, clonedResponse));
                        return response;
                    }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), 3000)
                )
            ]).catch(() => {
                return caches.match(event.request)
                    .then(cachedResponse => {
                        return cachedResponse || caches.match('/offline');
                    });
            })
        );
        return;
    }

    // Image requests - Cache First with network fallback
    if (isImageRequest(event.request.url)) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    return cachedResponse || fetch(event.request)
                        .then(response => {
                            const clonedResponse = response.clone();
                            caches.open(DYNAMIC_CACHE_NAME)
                                .then(cache => cache.put(event.request, clonedResponse));
                            return response;
                        });
                })
                .catch(() => {
                    // Return a placeholder image or fallback
                    return caches.match('/default-thumbnail.png');
                })
        );
        return;
    }

    // HTML pages - Network First with cache fallback
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then(cache => cache.put(event.request, clonedResponse));
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then(cachedResponse => {
                            return cachedResponse || caches.match('/offline');
                        });
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
                        const clonedResponse = response.clone();
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(cache => cache.put(event.request, clonedResponse));
                        return response;
                    });
                return cachedResponse || fetchPromise;
            })
    );
});

// Handle push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: '/blogs'  // Direct to blogs page when notification is clicked
        }
    };

    event.waitUntil(
        self.registration.showNotification('Blog Website', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(windowClients => {
                if (windowClients.length > 0) {
                    windowClients[0].focus();
                    windowClients[0].navigate(event.notification.data.url);
                } else {
                    clients.openWindow(event.notification.data.url);
                }
            })
    );
});
