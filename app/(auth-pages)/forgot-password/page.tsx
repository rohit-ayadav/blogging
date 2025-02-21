"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { isValidEmail } from '@/lib/common-function';
import { findEmailFromUserName } from '@/action/checkUserNameAvailability';
import Link from 'next/link';

export default function ForgotPassword() {
    const [identifier, setIdentifier] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const router = useRouter();

    // Effect to manage countdown timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldownTime > 0) {
            timer = setInterval(() => {
                setCooldownTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) {
                clearInterval(timer); // Clear interval on unmount
                // Reset cooldown time
                setCooldownTime(0);
                // Reset attempts
                localStorage.setItem('passwordResetAttempts', '0');
            }
        }
    }, [cooldownTime]);

    // Check if request is allowed based on local storage
    const checkRequestAllowed = () => {
        const lastRequestTime = localStorage.getItem('lastPasswordResetRequest');
        if (lastRequestTime) {
            const timeSinceLastRequest = Date.now() - parseInt(lastRequestTime);
            return timeSinceLastRequest > 60000; // 60 seconds between requests
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Check if another request is too soon
        if (!checkRequestAllowed()) {
            setError('Please wait 60 seconds between reset requests');
            return;
        }

        // Check if we've exceeded max attempts
        const attempts = parseInt(localStorage.getItem('passwordResetAttempts') || '0');
        if (attempts >= 3) {
            // setError('Too many reset attempts. Please try again later.');
            // setCooldownTime(300); // 5-minute cooldown
            // return;
        }

        setIsLoading(true);
        const trimmedIdentifier = identifier.trim();

        if (!trimmedIdentifier) {
            setError('Email or username is required');
            setIsLoading(false);
            return;
        }

        try {
            let validatedEmail = trimmedIdentifier;
            if (!isValidEmail(trimmedIdentifier)) {
                const emailFromUserName = await findEmailFromUserName(trimmedIdentifier);
                if (emailFromUserName) {
                    validatedEmail = emailFromUserName;
                } else {
                    setError('Invalid email or username');
                    setIsLoading(false);
                    return;
                }
            }

            // Send password reset request
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: validatedEmail, username: trimmedIdentifier }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Password reset request failed');
            }

            // Store request timestamp and increment attempts
            localStorage.setItem('lastPasswordResetRequest', Date.now().toString());
            const currentAttempts = (parseInt(localStorage.getItem('passwordResetAttempts') || '0') + 1);
            localStorage.setItem('passwordResetAttempts', currentAttempts.toString());

            const result = await response.json();
            setSuccess(result.message);
            setCooldownTime(30); // 30-second cooldown

        } catch (err) {
            const error = err as Error;
            toast.error(error.message || 'Password reset request failed');
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Reset Your Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded relative" role="alert">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Email address or username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            aria-label="Email or Username"
                            required
                            autoComplete='email'
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || cooldownTime > 0}
                        className="w-full"
                    >
                        {cooldownTime > 0
                            ? `Try again in ${cooldownTime} seconds`
                            : (isLoading ? 'Sending Reset Request...' : 'Reset Password')
                        }
                    </Button>

                    <div className="text-center mt-4">
                        <Link href="/login">
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Back to Login
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}