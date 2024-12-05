"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import checkUsernameAvailability from '@/action/checkUserNameAvailability';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const SignupPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<{
        name: string;
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        profilePic: File | null;
    }>({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: null,
    });
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const createUser = async () => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.message == "User already exists") {
                setError('It seems you already have an account with us. Please log in to continue.')
            }
            else {
                setError((data as any).message);
            }
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data;
        } catch (error) {
            throw new Error("An error occurred");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!usernameAvailable) {
            setError('Username is not available');
            return;
        }

        try {
            await toast.promise(createUser(), {
                loading: 'Creating account...',
                success: 'Account created successfully.',
                error: (err) => err.message || 'An error occurred',
            });
            await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            router.push('/profile');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 flex items-center justify-center p-4 lg:p-0">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center">
                {/* Left Side - Decorative Section */}
                <div className="hidden lg:block lg:w-1/2 p-12 text-white">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold leading-tight">
                            Welcome to DevBloggers
                        </h1>
                        <p className="text-xl text-purple-100">
                            Join the community of developers and share your knowledge with others.
                        </p>
                        <div className="flex space-x-4 mt-8">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h3 className="text-2xl font-semibold">100+</h3>
                                <p className="text-sm text-purple-200">Active Users</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h3 className="text-2xl font-semibold">50+</h3>
                                <p className="text-sm text-purple-200">Articles</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="p-8 sm:p-10">
                            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
                                Create your account
                            </h2>

                            <div className="flex flex-col items-center mb-6">
                                <div className="w-28 h-28 relative group">
                                    <Image
                                        src="/default-profile.jpg"
                                        alt="Profile Picture"
                                        fill
                                        className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-full">
                                        <span className="text-white text-sm">Change</span>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 text-sm"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="username" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={formData.username}
                                        onChange={async (e) => {
                                            handleInputChange(e);
                                            const username = e.target.value;
                                            if (username) {
                                                const available = await checkUsernameAvailability(username);
                                                setUsernameAvailable(available);
                                                if (!available) {
                                                    setUsernameError('Username is not available');
                                                } else {
                                                    setUsernameError('');
                                                }
                                            }
                                            else if (username === '') {
                                                setUsernameError('Username is required');
                                            }
                                            else {
                                                setUsernameError('');
                                                setUsernameAvailable(false);
                                            }
                                        }
                                        }
                                        className="mt-1 text-sm"
                                    />

                                    {usernameError && (
                                        <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                                    )}
                                    {usernameAvailable && (
                                        <p className="text-green-500 text-xs mt-1">Username is available</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 text-sm"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="mt-1 text-sm"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="mt-1 text-sm"
                                    />
                                </div>

                                {error && (
                                    <Alert variant="destructive" className="text-xs sm:text-sm">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                                >
                                    Sign up
                                </Button>
                            </form>

                            <div className="mt-6">
                                <Separator className="my-4">
                                    <span className="px-2 text-sm text-gray-500">Or continue with</span>
                                </Separator>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full hover:bg-red-50 transition-colors duration-300"
                                        onClick={() => signIn('google')}
                                    >
                                        <FaGoogle className="h-5 w-5 mr-2 text-red-500" />
                                        Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full hover:bg-gray-50 transition-colors duration-300"
                                        onClick={() => signIn('github')}
                                    >
                                        <FaGithub className="h-5 w-5 mr-2 text-gray-800" />
                                        GitHub
                                    </Button>
                                </div>
                            </div>

                            <div className="text-center mt-6">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                                >
                                    Already have an account? Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;