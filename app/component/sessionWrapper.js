"use client";
import { SessionProvider } from 'next-auth/react'
import SubscriptionPopup from '../blogs/SubscriptionPopup';

const SessionWrapper = ({ children }) => {
    return (
        <SessionProvider>
            <SubscriptionPopup />
            {children}
        </SessionProvider>
    )
};

export default SessionWrapper;