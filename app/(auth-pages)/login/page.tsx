"use client";
import { useState, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { findEmailFromUserName } from '@/action/checkUserNameAvailability';
import { isValidEmail } from '@/lib/common-function';
import { ArrowBigLeft, Home, Loader2 } from 'lucide-react';
import SocialLogin from '@/components/signup/SocialLogin';
import Link from 'next/link';

interface AuthError {
    message: string;
    field?: 'email' | 'password';
}

export default function Auth() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<AuthError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null); // Clear error when user types
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { email, password } = formData;
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        try {
            // Validation
            if (!trimmedEmail) {
                throw { message: 'Email or username is required', field: 'email' } as AuthError;
            }
            if (!trimmedPassword) {
                throw { message: 'Password is required', field: 'password' } as AuthError;
            }

            // Email validation and username lookup
            let validatedEmail = trimmedEmail;
            if (!isValidEmail(trimmedEmail)) {
                const emailFromUserName = await findEmailFromUserName(trimmedEmail);
                if (!emailFromUserName) {
                    throw { message: 'Invalid email or username', field: 'email' } as AuthError;
                }
                validatedEmail = emailFromUserName;
            }

            // Authentication
            const result = await signIn('credentials', {
                redirect: false,
                email: validatedEmail,
                password: trimmedPassword,
            });

            if (result?.ok) {
                toast.success('Sign in successful');
                router.push('/profile');
            } else {
                throw new Error(result?.error || 'Authentication failed');
            }
        } catch (err) {
            const error = err as Error | AuthError;
            if ('field' in error) {
                setError(error as AuthError);
            } else {
                const message = error.message === 'Password is not a string'
                    ? 'Please try signing in with Google or GitHub'
                    : error.message;
                setError({ message });
            }
            toast.error(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (session) {
        router.push('/dashboard?from=login');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Home"
                        >
                            <Home className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
                            {error.message}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email address or username"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${error?.field === 'email' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                aria-label="Email or Username"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10 ${error?.field === 'password' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                aria-label="Password"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Link href="/forgot-password">
                            <Button
                                type="button"
                                variant="link"
                                className="text-sm"
                            >
                                Forgot password?
                            </Button>
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                    <SocialLogin isLoading={isLoading} />
                    <div className="text-center">
                        <Link href={`/signup`}>
                            <Button
                                type="button"
                                variant="link"
                            >
                                Don't have an account? Sign up
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}