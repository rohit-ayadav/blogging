"use client";
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const { data: session } = useSession();
    if (session) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">
                        You are already signed in.
                    </h2>
                    <button
                        onClick={() => signOut()}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4"
                    >
                        Sign out
                    </button>
                    <button
                        onClick={() => router.push('/profile')}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => router.push('/blogs')}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                    >
                        Go to Blogs
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLogin) {
            setError(null);
            await toast.promise(signIn('credentials', {
                redirect: false,
                email,
                password,
            }), {
                loading: 'Signing in...',
                success: (data) => {
                    if (data?.ok) {
                        router.push('/profile');
                        return 'Sign in successful';
                    }
                    throw new Error(data?.error || 'Sign in failed');
                },
                error: (error) => {
                    return error.message || 'Sign in failed';
                },
            });
        } else {
            router.push('/signup');
        }
    }

    const handleGoogleLogin = async () => {
        await signIn('google', { callbackUrl: '/profile' });
    };

    const handleGithubLogin = async () => {
        await signIn('github', { callbackUrl: '/profile' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <Separator className="my-4">
                        <span className="px-2 text-sm text-gray-500">Or continue with</span>
                    </Separator>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full" onClick={() => signIn('google')}>
                            <FaGoogle className="h-5 w-5 mr-2" />
                            Google
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => signIn('github')}>
                            <FaGithub className="h-5 w-5 mr-2" />
                            GitHub
                        </Button>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => router.push('/signup')}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}
