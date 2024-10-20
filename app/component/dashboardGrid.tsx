import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';

interface BlogPostType {
    _id: string;
    title: string;
    content: string;
    views: number;
    likes: number;
}

interface DashboardGridProps {
    posts: BlogPostType[];
    totalViews: number;
    totalLikes: number;
    users: { [key: string]: any };
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ posts, totalViews, totalLikes, users }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4">
            <StatsCard title="Total Posts" value={posts.length} icon="📚" />
            <StatsCard title="Total Views" value={totalViews} icon="👀" />
            <StatsCard title="Total Likes" value={totalLikes} icon="❤️" />
            <StatsCard title="Active Writers" value={Object.keys(users).length} icon="✍️" />
        </div>
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

export default DashboardGrid;