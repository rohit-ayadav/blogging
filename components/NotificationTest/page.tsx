import React, { useState, useEffect } from 'react';
import { Bell, Image as ImageIcon, Clock, Send, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { z } from 'zod';

// Types for API responses
interface NotificationResult {
    success: boolean;
    endpoint: string;
    error?: string;
    timestamp: number;
}

interface ErrorBreakdown {
    [key: string]: {
        count: number;
        endpoints: string[];
    };
}

interface NotificationStatistics {
    totalDevices: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    deliveryRate: string;
    processingTime: string;
    errorBreakdown: ErrorBreakdown;
}

interface NotificationResponse {
    message: string;
    success: boolean;
    statistics: NotificationStatistics;
    details: NotificationResult[];
    metadata: {
        sender: string;
        timestamp: string;
        notificationType: string;
    };
}

interface GlobalStatistics {
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalSuccesses: number;
    totalFailures: number;
    averageSuccessRate: number;
}

// Custom URL validator that allows empty strings
const urlSchema = z.string().refine(
    (value) => {
        if (!value) return true; // Allow empty strings
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    { message: "Invalid URL format" }
);

// Zod schemas
const NotificationActionSchema = z.object({
    action: z.string().min(1, "Action is required"),
    title: z.string().min(1, "Title is required")
});

const NotificationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    image: urlSchema,
    icon: urlSchema,
    badge: urlSchema,
    tag: z.string(),
    timestamp: z.number(),
    vibrate: z.boolean(),
    renotify: z.boolean(),
    requireInteraction: z.boolean(),
    silent: z.boolean(),
    actions: z.array(NotificationActionSchema),
    url: urlSchema,
    ttl: z.number().min(0),
    urgency: z.enum(["very-low", "low", "normal", "high"]),
    topic: z.string()
}).transform((data) => {
    const cleaned = { ...data };
    (['image', 'icon', 'badge', 'url'] as (keyof typeof cleaned)[]).forEach((field) => {
        if (!cleaned[field]) {
            delete cleaned[field];
        }
    });
    return cleaned;
});

const NotificationAdminPanel = () => {
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [statistics, setStatistics] = useState<GlobalStatistics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState({
        title: 'Test Notification',
        message: 'If you see this, notifications are working!',
        image: '',
        icon: '',
        badge: '',
        tag: '',
        vibrate: true,
        requireInteraction: false,
        renotify: false,
        silent: false,
        url: '',
        timestamp: Date.now(),
        urgency: 'normal' as const,
        ttl: 86400,
        topic: '',
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Dismiss' }
        ]
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/send-notification');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.statistics) {
                setStatistics(data.statistics);
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setNotification(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const formatNotificationResults = (response: NotificationResponse): string => {
        const { statistics, metadata, details } = response;

        return `Delivery Statistics:
• Total Devices: ${statistics.totalDevices}
• Successful: ${statistics.successfulDeliveries}
• Failed: ${statistics.failedDeliveries}
• Delivery Rate: ${statistics.deliveryRate}
• Processing Time: ${statistics.processingTime}

Metadata:
• Sender: ${metadata.sender}
• Timestamp: ${metadata.timestamp}
• Type: ${metadata.notificationType}

Detailed Results:
${details.map(d => `• ${d.success ? '✅' : '❌'} ${d.endpoint}
  ${d.error ? `Error: ${d.error}` : ''}
  Time: ${new Date(d.timestamp).toLocaleString()}`).join('\n')}

${statistics.errorBreakdown && Object.keys(statistics.errorBreakdown).length > 0 ? `
Error Breakdown:
${Object.entries(statistics.errorBreakdown).map(([error, data]) =>
            `• ${error}: ${data.count} occurrences`
        ).join('\n')}` : ''}`;
    };

    const sendNotification = async () => {
        setError('');
        setStatus('');
        setIsLoading(true);

        try {
            // Validate notification data
            const validationResult = NotificationSchema.safeParse(notification);
            if (!validationResult.success) {
                throw new Error(validationResult.error.errors[0].message);
            }

            // Send only the validated and transformed data
            const validatedData = validationResult.data;

            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: NotificationResponse = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to send notification');
            }

            setStatus(formatNotificationResults(result));
            await fetchStatistics(); // Refresh statistics after successful send
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send notification');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Rich Notification Admin Panel
                </CardTitle>
                {statistics && (
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                            <Info className="h-4 w-4" />
                            <span>Active Subscriptions: {statistics.activeSubscriptions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Info className="h-4 w-4" />
                            <span>Success Rate: {(statistics.averageSuccessRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Info className="h-4 w-4" />
                            <span>Total Sent: {statistics.totalSuccesses + statistics.totalFailures}</span>
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={notification.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Notification Title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Message *</label>
                        <textarea
                            name="message"
                            value={notification.message}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                            placeholder="Notification Message"
                        />
                    </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                        <ImageIcon className="h-5 w-5" />
                        Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={notification.image}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Icon URL</label>
                            <input
                                type="url"
                                name="icon"
                                value={notification.icon}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder="https://example.com/icon.png"
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                        <AlertCircle className="h-5 w-5" />
                        Advanced Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Urgency</label>
                            <select
                                name="urgency"
                                value={notification.urgency}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="very-low">Very Low</option>
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Topic</label>
                            <input
                                type="text"
                                name="topic"
                                value={notification.topic}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder="Notification topic"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">TTL (seconds)</label>
                            <input
                                type="number"
                                name="ttl"
                                value={notification.ttl}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Tag</label>
                            <input
                                type="text"
                                name="tag"
                                value={notification.tag}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder="Notification tag"
                            />
                        </div>
                    </div>
                </div>

                {/* Options Section */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                        <AlertCircle className="h-5 w-5" />
                        Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-x-2">
                            <input
                                type="checkbox"
                                id="vibrate"
                                name="vibrate"
                                checked={notification.vibrate}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="vibrate">Vibrate</label>
                        </div>
                        <div className="space-x-2">
                            <input
                                type="checkbox"
                                id="requireInteraction"
                                name="requireInteraction"
                                checked={notification.requireInteraction}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="requireInteraction">Require Interaction</label>
                        </div>
                        <div className="space-x-2">
                            <input
                                type="checkbox"
                                id="renotify"
                                name="renotify"
                                checked={notification.renotify}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="renotify">Renotify</label>
                        </div>
                        <div className="space-x-2">
                            <input
                                type="checkbox"
                                id="silent"
                                name="silent"
                                checked={notification.silent}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="silent">Silent</label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="border-t pt-4">
                    <button
                        onClick={sendNotification}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                        <Send className="h-4 w-4" />
                        {isLoading ? 'Sending...' : 'Send Notification'}
                    </button>
                </div>

                {/* Status and Error Display */}
                {status && (
                    <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm overflow-x-auto">
                        {status}
                    </pre>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationAdminPanel;