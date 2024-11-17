// Configuration with performance settings
const CONFIG = {
    version: '1.0.1',
    debug: true,
    performance: {
        installTimeout: 10000,
        activateTimeout: 5000,
    },
    caches: {
        static: 'static-cache-v1.0.1',
        dynamic: 'dynamic-cache-v1.0.1',
        pages: 'pages-cache-v1.0.1',
        images: 'images-cache-v1.0.1',
        api: 'api-cache-v1.0.1'
    },
    strategies: {
        api: {
            timeout: 5000,
            maxAge: 10 * 60 * 1000
        },
        images: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60
        }
    }
};

const STATIC_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    '/icons/android-icon-192x192.png',
    '/icons/android-icon-512x512.png'
];

class PerformanceMonitor {
    static start(label) {
        if (CONFIG.debug) {
            console.time(`SW-${label}`);
            return Date.now();
        }
    }

    static end(label, startTime) {
        if (CONFIG.debug) {
            console.timeEnd(`SW-${label}`);
            const duration = Date.now() - startTime;
            console.log(`SW-${label} took ${duration}ms`);
        }
    }

    static async measureAsync(label, asyncFn) {
        const startTime = this.start(label);
        try {
            return await asyncFn();
        } finally {
            this.end(label, startTime);
        }
    }
}

class CacheManager {
    static async preCacheStaticAssets() {
        const cache = await caches.open(CONFIG.caches.static);
        const chunkSize = 3;
        const chunks = [];

        for (let i = 0; i < STATIC_ASSETS.length; i += chunkSize) {
            chunks.push(STATIC_ASSETS.slice(i, i + chunkSize));
        }

        await Promise.all(
            chunks.map(chunk =>
                Promise.all(chunk.map(async asset => {
                    try {
                        const response = await fetch(asset);
                        if (response.ok) {
                            await cache.put(asset, response);
                        }
                    } catch (error) {
                        console.warn(`Failed to cache ${asset}:`, error);
                    }
                }))
            )
        );
    }

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

class RequestHandler {
    static isApiRequest(url) {
        return url.includes('/api/') || url.includes('/graphql');
    }

    static isImageRequest(url) {
        return url.match(/\.(jpe?g|png|gif|svg|webp|avif)$/i);
    }

    static isHTMLRequest(request) {
        return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
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
            return Response.json({ error: 'Network error, please try again later' }, { status: 503 });
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
                await CacheManager.limitCacheSize(CONFIG.caches.images, CONFIG.strategies.images.maxEntries);
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

    static async handleDefaultRequest(event) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        try {
            const response = await fetch(event.request);
            if (response.ok) {
                const cache = await caches.open(CONFIG.caches.dynamic);
                await cache.put(event.request, response.clone());
                return response;
            }
            throw new Error('Network response was not ok');
        } catch (error) {
            return new Response('Network error occurred', { status: 503 });
        }
    }
}

async function handleInstall() {
    const startTime = PerformanceMonitor.start('install');

    try {
        const criticalAssets = ['/', '/offline', '/manifest.json'];
        const cache = await caches.open(CONFIG.caches.static);
        await cache.addAll(criticalAssets);
        await self.skipWaiting();

        setTimeout(() => {
            CacheManager.preCacheStaticAssets()
                .catch(error => console.warn('Background caching error:', error));
        }, 0);

    } catch (error) {
        console.error('Service Worker installation failed:', error);
    } finally {
        PerformanceMonitor.end('install', startTime);
    }
}

async function handleActivate() {
    const startTime = PerformanceMonitor.start('activate');

    try {
        await self.clients.claim();

        setTimeout(() => {
            CacheManager.deleteOldCaches()
                .catch(error => console.warn('Cache cleanup error:', error));
        }, 0);

    } catch (error) {
        console.error('Service Worker activation failed:', error);
    } finally {
        PerformanceMonitor.end('activate', startTime);
    }
}

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.race([
            handleInstall(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Install timeout')), CONFIG.performance.installTimeout)
            )
        ])
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.race([
            handleActivate(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Activate timeout')), CONFIG.performance.activateTimeout)
            )
        ])
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    const startTime = PerformanceMonitor.start(`fetch-${url.pathname}`);

    try {
        if (RequestHandler.isApiRequest(url.pathname)) {
            event.respondWith(RequestHandler.handleAPIRequest(event));
        } else if (RequestHandler.isImageRequest(url.pathname)) {
            event.respondWith(RequestHandler.handleImageRequest(event));
        } else if (RequestHandler.isHTMLRequest(event.request)) {
            event.respondWith(RequestHandler.handleHTMLRequest(event));
        } else {
            event.respondWith(RequestHandler.handleDefaultRequest(event));
        }
    } finally {
        PerformanceMonitor.end(`fetch-${url.pathname}`, startTime);
    }
});