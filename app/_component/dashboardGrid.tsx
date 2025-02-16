"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface DashboardGridProps {
    totalBlogs: number;
    totalViews: number;
    totalLikes: number;
    totalUsers: number;
    loading: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ totalBlogs, totalViews, totalLikes, totalUsers, loading }) => {
    const { isDarkMode } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className={`w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'dark' : ''}`}>
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {loading ? (
                    Array(4).fill(null).map((_, index) => (
                        <SkeletonStatsCard key={index} />
                    ))
                ) : (
                    <>
                        <StatsCard
                            title="Total Posts"
                            value={totalBlogs}
                            icon="📚"
                            trend={{ value: 12, label: 'from last month' }}
                            isDarkMode={isDarkMode}
                            color="blue"
                        />
                        <StatsCard
                            title="Total Views"
                            value={totalViews}
                            icon="👀"
                            trend={{ value: 8, label: 'from last month' }}
                            isDarkMode={isDarkMode}
                            color="green"
                        />
                        <StatsCard
                            title="Total Likes"
                            value={totalLikes}
                            icon="❤️"
                            trend={{ value: -5, label: 'from last month' }}
                            isDarkMode={isDarkMode}
                            color="red"
                        />
                        <StatsCard
                            title="Total Users"
                            value={totalUsers}
                            icon="👥"
                            trend={{ value: 15, label: 'from last month' }}
                            isDarkMode={isDarkMode}
                            color="purple"
                        />
                    </>
                )}
            </motion.div>
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
    isDarkMode: boolean;
    color: 'blue' | 'green' | 'red' | 'purple';
    trend?: {
        value: number;
        label: string;
    };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, isDarkMode, color }) => {
    const colorClasses = {
        blue: isDarkMode ? 'text-blue-400 bg-blue-400/10' : 'text-blue-600 bg-blue-100',
        green: isDarkMode ? 'text-green-400 bg-green-400/10' : 'text-green-600 bg-green-100',
        red: isDarkMode ? 'text-red-400 bg-red-400/10' : 'text-red-600 bg-red-100',
        purple: isDarkMode ? 'text-purple-400 bg-purple-400/10' : 'text-purple-600 bg-purple-100'
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
        >
            <Card
                className={`
                    relative overflow-hidden group
                    ${isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }
                    shadow-sm hover:shadow-xl transition-all duration-300
                    transform hover:-translate-y-1
                `}
            >
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-transparent to-transparent group-hover:from-current/5 transition-all duration-300" />

                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        <span className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {title}
                        </span>
                        <span className={`
                            p-2 rounded-lg text-lg sm:text-xl
                            ${colorClasses[color]}
                        `}>
                            {icon}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <p className={`
                        text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight
                        ${colorClasses[color].split(' ')[0]}
                    `}>
                        <CountUp
                            end={value}
                            duration={2.5}
                            separator=","
                            useEasing={true}
                        />
                    </p>

                    {trend && (
                        <div className="flex items-center text-sm sm:text-base space-x-2">
                            <span className={`
                                flex items-center font-medium px-2 py-1 rounded-full
                                ${trend.value >= 0
                                    ? (isDarkMode ? 'text-green-400 bg-green-400/10' : 'text-green-600 bg-green-100')
                                    : (isDarkMode ? 'text-red-400 bg-red-400/10' : 'text-red-600 bg-red-100')
                                }
                            `}>
                                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {trend.label}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const SkeletonStatsCard = () => {
    const { isDarkMode } = useTheme();

    return (
        <Card className={`
            flex flex-col justify-between h-full animate-pulse
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        `}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className={`h-6 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-10 w-10 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className={`h-12 w-2/3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="flex items-center space-x-2">
                    <div className={`h-6 w-16 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-6 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardGrid;