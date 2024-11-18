interface NotificationPayload {
  title: string;
  message: string;
  icon?: string;
  image?: string;
  badge?: string;
  timestamp?: number;
  url: string;
  urgency?: string;
  topic?: string;
  ttl?: number;
  tag?: string;
  vibrate?: boolean;
  requireInteraction?: boolean;
  renotify?: boolean;
  silent?: boolean;
  data?: Record<string, any>;
}

interface GlobalStatistics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalSuccesses: number;
  totalFailures: number;
  averageSuccessRate: number;
}

export type { NotificationPayload, GlobalStatistics };