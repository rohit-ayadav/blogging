// app/blogs/not-found.tsx
"use client";
import React from 'react';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <button
                onClick={() => window.history.back()}
                className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
                Go Back
            </button>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 max-w-2xl w-full">
                <div className="flex">
                    <div>
                        <p className="text-yellow-700">Blog Post Not Found</p>
                        <p className="text-yellow-700 mt-1">
                            The blog post you're looking for doesn't exist or has been removed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}