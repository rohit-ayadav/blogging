import { LRUCache } from "lru-cache";

const rateLimitOptions = {
  max: 100,
  ttl: 1000 * 60 * 15,
};

const rateLimitCache = new LRUCache(rateLimitOptions);

/**
 * Limits the number of requests from a specific IP address.
 *
 * @param ip - The IP address of the client making the request.
 * @returns A boolean indicating whether the request is allowed (true) or denied (false).
 */
export function rateLimit(ip: string) {
  const currentRequestCount = rateLimitCache.get(ip) as number | undefined;

  if (currentRequestCount !== undefined && currentRequestCount >= 5) {
    return false;
  }

  rateLimitCache.set(ip, (currentRequestCount ?? 0) + 1, {
    ttl: rateLimitOptions.ttl,
  });
  return true;
}
