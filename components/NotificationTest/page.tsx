import React, { useState, useEffect } from 'react';
import { Bell, Image as ImageIcon, AlertCircle, Info, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NotificationPayload, GlobalStatistics } from '@/types/notification-types';
import { BasicInformation, StatisticsPanel, MediaSection, AdvancedOptions, OptionsSection, StatusDisplay } from './BasicInformationForm';
import { request } from 'http';

// Main Component
const NotificationAdminPanel = () => {
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [statistics, setStatistics] = useState<GlobalStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<NotificationPayload>({
        title: "Welcome! 👋",
        message: "Your notifications are now set up successfully. Click to explore more.",
        icon: "https://as1.ftcdn.net/v2/jpg/09/15/85/08/1000_F_915850846_PYB5ChOp6ZVc0KGouKNKicwFNolwd5nZ.jpg",
        ttl: 86400,
        urgency: "normal",
        vibrate: true,
        requireInteraction: true,
        renotify: false,
        silent: false,
        url: "https://www.food.devblogger.in/blogs"
    });

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

    const sendNotification = async () => {
        setError('');
        setStatus('');
        setIsLoading(true);
        const requestBody = {
            payload: notification,
        };

        try {
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (!result.success) throw new Error(result.message || 'Failed to send notification');

            setStatus(JSON.stringify(result, null, 2));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send notification');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Rich Notification Admin Panel
                </CardTitle>
                {statistics && <StatisticsPanel statistics={statistics} />}
            </CardHeader>

            <CardContent className="space-y-6">
                <BasicInformation notification={notification} onChange={handleInputChange} />

                <div className="border-t pt-4">
                    <MediaSection notification={notification} onChange={handleInputChange} />
                </div>

                <div className="border-t pt-4">
                    <AdvancedOptions notification={notification} onChange={handleInputChange} />
                </div>

                <div className="border-t pt-4">
                    <OptionsSection notification={notification} onChange={handleInputChange} />
                </div>

                <div className="border-t pt-4">
                    <button
                        onClick={sendNotification}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Send className="h-4 w-4" />
                        {isLoading ? 'Sending...' : 'Send Notification'}
                    </button>
                </div>

                <StatusDisplay status={status} error={error} />
            </CardContent>
        </Card>
    );
};

export default NotificationAdminPanel;