"use client";
import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Github } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { set } from 'mongoose';

const SignupPage = () => {
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const file = files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profilePic: file }));
        }
    };

    const createUser = async () => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }

        console.log('Form submitted:', formData);
        setError('');
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await toast.promise(createUser(), {
            loading: 'Creating user...',
            success: 'User created successfully',
            error: 'Failed to create user',
        });

        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-white mb-6">
                    Create your account
                </h2>

                <div className="bg-white shadow-2xl rounded-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center">
                            {/* did not take input show avatar only */}
                            <Image src="/default-profile.jpg" alt="Profile Picture" width={100} height={100} className="rounded-full" />
                        </div>

                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
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
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
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
                                        try {
                                            const response = await fetch(`/api/check-username?username=${username}`);
                                            const data = await response.json();
                                            if (data.available) {
                                                setUsernameError('');
                                                setUsernameAvailable(true);
                                            } else {
                                                setUsernameError('Username is already taken');
                                                setUsernameAvailable(false);
                                            }
                                        } catch (error) {
                                            console.error('Error checking username:', error);
                                            setUsernameError('Error checking username');
                                            setUsernameAvailable(false);
                                        }
                                    } else {
                                        setUsernameError('');
                                    }
                                }}
                                className="mt-1"
                            />
                            {usernameError && (
                                <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                            )}
                            {usernameAvailable && (
                                <p className="text-green-500 text-sm mt-1">Username is available</p>
                            )}
                        </div>


                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
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
                                className="mt-1"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                            Sign up
                        </Button>
                    </form>

                    <div className="mt-6">
                        <Separator className="my-4">
                            <span className="px-2 text-sm text-gray-500">Or continue with</span>
                        </Separator>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full" onClick={() => signIn('google')}>
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => signIn('github')}>
                                <Github className="h-5 w-5 mr-2" />
                                GitHub
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;