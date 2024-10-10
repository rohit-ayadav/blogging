"use client";
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { set } from 'mongoose';

const signUp = async ({ email, password }: { email: string; password: string }) => {
    alert('Sign up is not implemented yet.');
    return { ok: true };
};

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    if (session) {
        console.log(session);
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
                        onClick={() => window.location.href = '/dashboard'}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => window.location.href = '/blogs'}
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
            toast.promise(signIn('credentials', {
                redirect: false,
                email,
                password,
            }), {
                loading: 'Signing in...',
                success: (data) => {
                    if ((data ?? {}).error === undefined) {
                        window.location.href = '/dashboard';
                        return 'Sign in successful';
                    }
                    window.location.href = '/dashboard';
                    return data?.error || 'Sign in Successful';
                },
                error: (error) => {
                    return error.error || 'Sign in failed';
                },
            });
        }
        else {
            window.location.href = '/signup';
        }
    }

    const handleGoogleLogin = async () => {
        signIn('google', { callbackUrl: '/dashboard' });

    };
    const handleGithubLogin = async () => {
        signIn('github', { callbackUrl: '/dashboard' });
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

                <div>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Sign in with Google
                    </button>
                    <button
                        onClick={handleGithubLogin}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-3"
                    >
                        Sign in with Github
                    </button>

                </div>

                <div className="text-center">
                    <button
                        onClick={() => window.location.href = '/signup'}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </div >
    );
}