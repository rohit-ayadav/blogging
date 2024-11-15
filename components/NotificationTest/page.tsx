import React, { useState, useEffect } from 'react';
import { Bell, Image as ImageIcon, Clock, Send, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { z } from 'zod';


const NotificationActionSchema = z.object({
    action: z.string().min(1, "Action is required"),
    title: z.string().min(1, "Title is required")
});

const NotificationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    image: z.string().url().optional(),
    icon: z.string().url().optional(),
    badge: z.string().url().optional(),
    tag: z.string().optional(),
    timestamp: z.number().optional(),
    vibrate: z.boolean().optional(),
    renotify: z.boolean().optional(),
    requireInteraction: z.boolean().optional(),
    silent: z.boolean().optional(),
    actions: z.array(NotificationActionSchema).optional(),
    url: z.string().url().optional(),
    data: z.record(z.any()).optional(),
    ttl: z.number().min(0).optional(), // Time To Live in seconds
    urgency: z.enum(["very-low", "low", "normal", "high"]).optional(),
    topic: z.string().optional()
});

interface Statistics {
    activeSubscriptions: number;
    averageSuccessRate: number;
    totalDevices: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    deliveryRate: number;
    processingTime: string;
}

const NotificationAdminPanel = () => {
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [statistics, setStatistics] = useState<Statistics | null>(null);
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
        // url: 'https://blogging-one-omega.vercel.app/blogs',
        url: '',
        timestamp: new Date().getTime(),
        urgency: 'normal',
        ttl: 86400, // 24 hours in seconds
        topic: '',
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Dismiss' }
        ]
    });

    // Fetch statistics on component mount
    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/send-notification', {
                method: 'GET'
            });
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (data.success) {
                    setStatistics(data.statistics);
                }
            } else {
                console.error('Unexpected content type:', contentType);
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setNotification(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateNotification = () => {
        if (!notification.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!notification.message.trim()) {
            setError('Message is required');
            return false;
        }
        if (notification.image && !isValidUrl(notification.image)) {
            setError('Invalid image URL');
            return false;
        }
        if (notification.icon && !isValidUrl(notification.icon)) {
            setError('Invalid icon URL');
            return false;
        }
        if (notification.badge && !isValidUrl(notification.badge)) {
            setError('Invalid badge URL');
            return false;
        }

        if (notification.actions) {
            for (const action of notification.actions) {
                const result = NotificationActionSchema.safeParse(action);
                if (!result.success) {
                    setError(result.error.errors[0].message);
                    return false;
                }
            }
        }
        return true;
    };



    const isValidUrl = (string: string): boolean => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const sendNotification = async () => {
        setError('');
        setStatus('');

        if (!validateNotification()) {
            return;
        }

        // validate notification with schema
        const result = NotificationSchema.safeParse(notification);
        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }


        try {
            setStatus('Sending notification...');
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notification),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to send notification');
            }

            setStatus('Notification sent successfully!');
            // Display detailed statistics
            const stats = result.statistics;
            setStatus(prev => `${prev}\n\nDelivery Statistics:
• Total Devices: ${stats.totalDevices}
• Successful: ${stats.successfulDeliveries}
• Failed: ${stats.failedDeliveries}
• Delivery Rate: ${stats.deliveryRate}
• Processing Time: ${stats.processingTime}
• Average Success Rate: ${stats.averageSuccessRate * 100}%
• Error Breakdown: ${stats.errorBreakdown.join(', ')}
\n\nMetadata:
• Sender: ${result.metadata.sender}
• Timestamp: ${result.metadata.timestamp}
• Notification Type: ${result.metadata.notificationType}


• Additional Details:
${result.details.map((d: any) => `\n\n• ${d.success ? '✅' : '❌'} Endpoint: ${d.endpoint}
    • Timestamp: (${d.timestamp})`).join('\n')}
`);
            // Refresh statistics after sending
            fetchStatistics();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to send notification');
            } else {
                setError('Failed to send notification');
            }
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
                            Active Subscriptions: {statistics.activeSubscriptions}
                        </div>
                        <div>Success Rate: {(statistics.averageSuccessRate * 100).toFixed(1)}%</div>
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
                        <label className="block text-sm font-medium">Message</label>
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

                {/* Timestamp */}
                <div className="border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <label className="block text-sm font-medium">Schedule Time</label>
                    </div>
                    <input
                        type="datetime-local"
                        name="timestamp"
                        value={new Date(notification.timestamp).toISOString().slice(0, 16)}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'timestamp',
                                value: new Date(e.target.value).getTime().toString()
                            }
                        } as unknown as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full p-2 border rounded mt-2"
                    />
                </div>

                {/* Submit Button */}
                <div className="border-t pt-4">
                    <button
                        onClick={sendNotification}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        <Send className="h-4 w-4" />
                        Send Notification
                    </button>
                </div>

                {/* Status and Error Display */}
                {status && (
                    <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
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