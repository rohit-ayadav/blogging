import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';
import { useTheme } from '@/context/ThemeContext';

interface BlogPostType {
    _id: string;
    title: string;
    content: string;
    views: number;
    likes: number;
}
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
        // Set body to dark mode if dark mode is enabled
        if (isDarkMode) {
            document.body.classList.add('dark');
        }
        if (!isDarkMode) {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4">
                {loading
                    ? Array(4)
                        .fill(null)
                        .map((_, index) => <SkeletonStatsCard key={index} />)
                    : (
                        <>
                            <StatsCard title="Total Posts" value={totalBlogs} icon="📚" />
                            <StatsCard title="Total Views" value={totalViews} icon="👀" />
                            <StatsCard title="Total Likes" value={totalLikes} icon="❤️" />

                            <StatsCard title="Total Users" value={totalUsers} icon="👥" />
                        </>
                    )}
            </div>
        </>
    );
};

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
    <Card className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                <span className="mr-2 text-xl">{icon}</span>
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={value} duration={2} />
            </p>
        </CardContent>
    </Card>
);

const SkeletonStatsCard = () => (
    <Card className="flex flex-col justify-between h-full animate-pulse">
        <CardHeader className="pb-2">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardHeader>
        <CardContent>
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
    </Card>
);

export default DashboardGrid;