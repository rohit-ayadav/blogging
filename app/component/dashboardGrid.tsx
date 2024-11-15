import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';
import { useTheme } from '@/context/ThemeContext';

interface DashboardGridProps {
    totalBlogs: number;
    totalViews: number;
    totalLikes: number;
    totalUsers: number;
    loading: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ totalBlogs, totalViews, totalLikes, totalUsers, loading }) => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                        />
                        <StatsCard
                            title="Total Views"
                            value={totalViews}
                            icon="👀"
                            trend={{ value: 8, label: 'from last month' }}
                        />
                        <StatsCard
                            title="Total Likes"
                            value={totalLikes}
                            icon="❤️"
                            trend={{ value: -5, label: 'from last month' }}
                        />
                        <StatsCard
                            title="Total Users"
                            value={totalUsers}
                            icon="👥"
                            trend={{ value: 15, label: 'from last month' }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
    trend?: {
        value: number;
        label: string;
    };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => (
    <Card className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                <span className="mr-2 text-lg sm:text-xl">{icon}</span>
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={value} duration={2} separator="," />
            </p>
            {trend && (
                <div className="flex items-center text-sm">
                    <span className={`flex items-center ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">{trend.label}</span>
                </div>
            )}
        </CardContent>
    </Card>
);

const SkeletonStatsCard = () => (
    <Card className="flex flex-col justify-between h-full animate-pulse">
        <CardHeader className="pb-2">
            <div className="h-5 sm:h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="h-8 sm:h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
    </Card>
);

export default DashboardGrid;