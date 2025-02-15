import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePushClient, usePushSubscription } from '@/hooks/push-client';
import { useTheme } from '@/context/ThemeContext';

const POPUP_SHOWN_KEY = 'notification-popup-shown';
const POPUP_COOLDOWN = 1 * 24 * 60 * 60 * 1000; // 1 day
const NOTIFICATION_DELAY = 16000; // 16 seconds

type PopupState = {
    show: boolean;
    permissionDenied: boolean;
};

const canShowPopup = () => {
    try {
        const lastShown = localStorage.getItem(POPUP_SHOWN_KEY);
        if (!lastShown) return true;

        const timeSinceLastShown = Date.now() - parseInt(lastShown, 10);
        return timeSinceLastShown > POPUP_COOLDOWN;
    } catch (error) {
        console.error('Error checking popup visibility:', error);
        return true;
    }
};

const updatePopupTimestamp = () => {
    try {
        localStorage.setItem(POPUP_SHOWN_KEY, Date.now().toString());
    } catch (error) {
        console.error('Failed to update popup timestamp:', error);
    }
};


const AlertContent = ({
    isDark,
    title,
    description,
    onClose,
    onSubscribe,
    showSubscribeButton = false
}: {
    isDark: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onSubscribe?: () => void;
    showSubscribeButton?: boolean;
}) => (
    <Alert className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <button
            onClick={onClose}
            className={`absolute right-2 top-2 p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Close"
        >
            <X className="h-4 w-4" />
        </button>

        <AlertTitle className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>
            {title}
        </AlertTitle>

        <AlertDescription className="mt-2">
            <p className={`mb-4 ${isDark ? 'text-white' : ''}`}>
                {description}
            </p>

            {showSubscribeButton && onSubscribe && (
                <button
                    onClick={onSubscribe}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Enable Notifications
                </button>
            )}
        </AlertDescription>
    </Alert>
);

const SubscriptionPopup = () => {
    const [popupState, setPopupState] = useState<PopupState>({
        show: false,
        permissionDenied: false
    });
    const [isEligibleToShow, setIsEligibleToShow] = useState(false);

    const { initializePush } = usePushClient();
    const { isSubscribed } = usePushSubscription();
    const { isDarkMode } = useTheme();


    const isBrowserSupported = useCallback(() => {
        return 'serviceWorker' in navigator && 'Notification' in window;
    }, []);


    useEffect(() => {
        const checkEligibility = () => {
            const eligible = !isSubscribed && canShowPopup() && isBrowserSupported();
            setIsEligibleToShow(eligible);
        };

        checkEligibility();
    }, [isSubscribed]);


    const checkNotificationPermission = useCallback(() => {
        if (!isEligibleToShow) return;

        const permission = Notification.permission;
        if (permission === 'denied') {
            setPopupState(prev => ({ ...prev, permissionDenied: true }));
        } else if (permission !== 'granted') {
            setPopupState(prev => ({ ...prev, show: true }));
            updatePopupTimestamp();
        }
    }, [isEligibleToShow]);


    useEffect(() => {
        if (isEligibleToShow) {
            const timer = setTimeout(checkNotificationPermission, NOTIFICATION_DELAY);
            return () => clearTimeout(timer);
        }
    }, [isEligibleToShow, checkNotificationPermission]);


    const handleClose = useCallback(() => {
        setPopupState({ show: false, permissionDenied: false });
    }, []);


    const handleSubscribe = useCallback(async () => {
        try {
            setPopupState(prev => ({ ...prev, show: false }));
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                await initializePush();
            } else {
                setPopupState(prev => ({ ...prev, permissionDenied: true }));
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            handleClose();
        }
    }, [initializePush, handleClose]);

    if (!popupState.show && !popupState.permissionDenied) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
            {popupState.permissionDenied ? (
                <AlertContent
                    isDark={isDarkMode}
                    title="Notification Permission Denied"
                    description="You have denied permission for notifications. Please enable notifications from your browser settings to stay updated on our latest blog posts."
                    onClose={handleClose}
                />
            ) : (
                <AlertContent
                    isDark={isDarkMode}
                    title="Stay Updated!"
                    description="Never miss our latest blog posts! Enable notifications to get updates on new content."
                    onClose={handleClose}
                    onSubscribe={handleSubscribe}
                    showSubscribeButton={true}
                />
            )}
        </div>
    );
};

export default SubscriptionPopup;