"use client";
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { findEmailFromUserName } from '@/action/checkUserNameAvailability';
import { isValidEmail } from '@/lib/common-function';

const validatePassword = (password: string) => {
    return password.length >= 8;
};

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
                <div className="space-y-4 w-full max-w-md">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        You are already signed in
                    </h2>
                    <div className="space-y-3">
                        {['dashboard', 'blogs', 'profile'].map((route) => (
                            <button
                                key={route}
                                onClick={() => router.push(`/${route}`)}
                                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Go to {route.charAt(0).toUpperCase() + route.slice(1)}
                            </button>
                        ))}
                        <button
                            onClick={() => signOut()}
                            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        setEmail(email.trim());

        if (!email.trim()) {
            setError('Email or username is required');
            setIsLoading(false);
            return;
        }

        // if (!validatePassword(password)) {
        //     setError('Password must be at least 8 characters long');
        //     setIsLoading(false);
        //     return;
        // }

        if (!password.trim()) {
            setError('Password is required');
            setIsLoading(false);
            return;
        }

        try {
            let validatedEmail = email;
            if (!isValidEmail(email)) {
                const emailFromUserName = await findEmailFromUserName(email);
                if (emailFromUserName) {
                    validatedEmail = emailFromUserName;
                } else {
                    setError('Invalid email or username');
                    setIsLoading(false);
                    return;
                }
            }

            const result = await signIn('credentials', {
                redirect: false,
                email: validatedEmail,
                password,
            });

            if (result?.ok) {
                toast.success('Sign in successful');
                router.push('/profile');
            } else {
                throw new Error(result?.error || 'Authentication failed');
            }
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || 'Authentication failed');
            if (error.message === 'Password is not a string') {
                setError('Kindly try again with your Google or GitHub account');
            } else {
                setError(error.message);
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Email address or username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            aria-label="Email or Username"
                            required
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                aria-label="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => {
                                    const message = `Hello, I forgot my password. My registered email is ${email || '[Enter Your Email]'}. Please help me reset it.`;
                                    const encodedMessage = encodeURIComponent(message);
                                    const whatsappLink = `http://wa.me/+916392177974?text=${encodedMessage}`;
                                    window.open(whatsappLink, '_blank');
                                }}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>

                    <Separator className="my-4">
                        <span className="px-2 text-sm text-gray-500">Or continue with</span>
                    </Separator>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => signIn('google')}
                            disabled={isLoading}
                        >
                            <FaGoogle className="h-5 w-5 mr-2 text-red-500" /> Google
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => signIn('github')}
                            disabled={isLoading}
                        >
                            <FaGithub className="h-5 w-5 mr-2 text-gray-700" /> GitHub
                        </Button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/signup')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Don't have an account? Sign up
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}