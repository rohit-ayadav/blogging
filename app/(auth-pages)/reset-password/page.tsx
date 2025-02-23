"use client";
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';

function PasswordResetContent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const { data, status } = useSession();

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (status === 'authenticated') {
            setError('You are already logged in, you can change your password in your profile');
            toast.error('You are already logged in, you can change your password in your profile');
            new Promise(resolve => setTimeout(resolve, 3000)).then(() =>
                router.push('/profile'));
        }
        if (!searchParams.has('token') || !searchParams.has('email')) {
            setError('Invalid reset link');
            return;
        }
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        setToken(token);
        setEmail(email);
    }, [searchParams, status]);

    useEffect(() => {
        if (password)
            validatePassword(password);
    }, [password]);

    const validatePassword = (pwd: string) => {
        const errors: string[] = [];
        if (!/[A-Z]/.test(pwd)) errors.push("Must contain an uppercase letter");
        if (!/[a-z]/.test(pwd)) errors.push("Must contain a lowercase letter");
        if (!/[0-9]/.test(pwd)) errors.push("Must contain a number");
        if (!/[!@#$%^&*]/.test(pwd)) errors.push("Must contain a special character");
        if (pwd.length < 8) errors.push("Password must be at least 8 characters");
        if (errors.length === 0) setError(null);
        else
            setError(errors[0]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!token || !email) {
            setError('Invalid reset link');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        validatePassword(password);

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                    email,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Password reset failed');
            }

            toast.success('Password reset successful');
            router.push('/login');
        } catch (err) {
            const error = err as Error;
            toast.error(error.message);
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
                    {error && password.length > 0 && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                required
                                autoComplete='new-password'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            autoComplete='new-password'
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function PasswordReset() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PasswordResetContent />
        </Suspense>
    );
}