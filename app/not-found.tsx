"use client";
import React from 'react';
import Link from 'next/link';
import { HomeIcon, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar404 from './_component/SearchBar404';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Error Code and Illustration */}
                <div className="relative">
                    <h1 className="text-[150px] font-bold text-gray-200 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-48 h-48 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have vanished into the digital void.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Search Bar */}
                <SearchBar404 />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <Link href="/">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto inline-flex items-center justify-center gap-2"
                        >
                            <HomeIcon className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>

                </div>

                {/* Quick Links */}
                <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Popular Pages</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            ['Blog', '/blogs'],
                            ['Dashboard', '/dashboard'],
                            ['About', '/about'],
                            ['Contact', '/contacts'],
                            // ['Help Center', '/help'],
                        ].map(([label, href]) => (
                            <Link
                                key={label}
                                href={href}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;