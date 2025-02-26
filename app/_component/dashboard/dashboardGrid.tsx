"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { SkeletonStatsCard } from './SkeletonStatsCard';
import { StatsCard } from './StatsCard';

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
                staggerChildren: 0.15
            }
        }
    };

    return (
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4">
            <motion.div
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
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
                            trend={{ value: 12, label: 'vs last month' }}
                            isDarkMode={isDarkMode}
                            color="blue"
                        />
                        <StatsCard
                            title="Total Views"
                            value={totalViews}
                            icon="👀"
                            trend={{ value: 8, label: 'vs last month' }}
                            isDarkMode={isDarkMode}
                            color="green"
                        />
                        <StatsCard
                            title="Total Likes"
                            value={totalLikes}
                            icon="❤️"
                            trend={{ value: -5, label: 'vs last month' }}
                            isDarkMode={isDarkMode}
                            color="red"
                        />
                        <StatsCard
                            title="Total Users"
                            value={totalUsers}
                            icon="👥"
                            trend={{ value: 15, label: 'vs last month' }}
                            isDarkMode={isDarkMode}
                            color="purple"
                        />
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default DashboardGrid;