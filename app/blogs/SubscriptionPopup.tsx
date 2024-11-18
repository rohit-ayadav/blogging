import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePushClient, usePushSubscription } from '@/hooks/push-client';

const SubscriptionPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const { initializePush } = usePushClient();
    const { isSubscribed } = usePushSubscription();

    useEffect(() => {

        if (!isSubscribed) {
            const timer = setTimeout(() => {
                if ('serviceWorker' in navigator && 'Notification' in window) {
                    if (Notification.permission !== 'denied') {
                        setShowPopup(true);
                    }
                }
            }, 16000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
    };

    const handleSubscribe = async () => {
        try {
            setShowPopup(false);
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                initializePush();
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    if (!showPopup) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
            <Alert className="relative bg-white shadow-lg">
                <button
                    onClick={handleClose}
                    className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                <AlertTitle className="text-lg font-semibold">
                    Stay Updated!
                </AlertTitle>

                <AlertDescription className="mt-2">
                    <p className="mb-4">
                        Never miss our latest blog posts! Enable notifications to get updates on new content.
                    </p>

                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Enable Notifications
                    </button>
                </AlertDescription>
            </Alert>
        </div>
    );
}

export default SubscriptionPopup;