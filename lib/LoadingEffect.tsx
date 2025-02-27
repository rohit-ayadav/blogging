"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const LoadingEffect = () => {
    const { isDarkMode } = useTheme();

    // Generate random positions for circles
    const generateCircles = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100, // random percentage across screen width
            y: Math.random() * 100, // random percentage across screen height
            size: Math.random() * 80 + 20, // size between 20px and 100px
            delay: Math.random() * 2,
            duration: Math.random() * 4 + 3,
        }));
    };

    const circles = generateCircles(30);

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Background circles spread across the screen */}
            {circles.map((circle) => (
                <motion.div
                    key={circle.id}
                    className="absolute rounded-full"
                    style={{
                        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                        width: `${circle.size}px`,
                        height: `${circle.size}px`,
                        left: `${circle.x}%`,
                        top: `${circle.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: circle.duration,
                        delay: circle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Center content */}
            <div className="z-10 flex flex-col items-center">
                {/* Logo placeholder with proper centering */}
                <div className="flex justify-center items-center mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="relative w-12 h-12"
                    >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 4V20M4 12H20"
                                stroke="url(#gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="4" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#2563EB" />
                                    <stop offset="1" stopColor="#4F46E5" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                </div>

                {/* Loading text with gradient */}
                <motion.h2
                    className="mt-8 text-xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    Loading...
                </motion.h2>

                {/* Horizontal progress bar */}
                <div className="mt-4 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingEffect;