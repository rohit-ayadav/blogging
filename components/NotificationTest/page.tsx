// components/NotificationTest.tsx
import React, { useState } from 'react';

export default function NotificationTest() {
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const testNotification = async () => {
        try {
            setStatus('Checking service worker...');
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                throw new Error('Service worker not registered');
            }

            setStatus('Checking subscription...');
            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                throw new Error('No push subscription found');
            }

            setStatus('Sending test notification...');
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Test Notification',
                    message: 'Testing at ' + new Date().toLocaleTimeString(),
                }),
            });

            const result = await response.json();
            setStatus('Server response: ' + JSON.stringify(result, null, 2));

            // Check subscription details
            setStatus(prev => prev + '\n\nSubscription details:\n' +
                `Endpoint: ${subscription.endpoint}\n` +
                `Auth: ${subscription.options.applicationServerKey ? 'Present' : 'Missing'}`
            );

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <button
                onClick={testNotification}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Send Test Notification
            </button>

            {status && (
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                    {status}
                </pre>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded">
                    {error}
                </div>
            )}
        </div>
    );
}