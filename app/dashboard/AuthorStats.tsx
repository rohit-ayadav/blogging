import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { UserType, BlogPostType } from '@/types/blogs-types';
interface AuthorStatsProps {
    posts: BlogPostType[];
    monthlyStats: { month: string; views: number; likes: number }[];
}

export const AuthorStats = ({ posts, monthlyStats }: AuthorStatsProps) => {
    const stats = useMemo(() => {
        // Calculate total views and likes
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

        // Calculate current month stats
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        const currentMonthStats = monthlyStats?.filter(stat => stat.month === currentMonth) || [];
        const currentMonthViews = currentMonthStats.reduce((sum, stat) => sum + stat.views, 0);
        const currentMonthLikes = currentMonthStats.reduce((sum, stat) => sum + stat.likes, 0);

        // Calculate previous month stats
        const prevMonth = currentDate.getMonth() === 0
            ? `${currentDate.getFullYear() - 1}-12`
            : `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;

        const prevMonthStats = monthlyStats?.filter(stat => stat.month === prevMonth) || [];
        const prevMonthViews = prevMonthStats.reduce((sum, stat) => sum + stat.views, 0);
        const prevMonthLikes = prevMonthStats.reduce((sum, stat) => sum + stat.likes, 0);

        // Calculate growth percentages
        const viewsGrowth = prevMonthViews ? ((currentMonthViews - prevMonthViews) / prevMonthViews) * 100 : 0;
        const likesGrowth = prevMonthLikes ? ((currentMonthLikes - prevMonthLikes) / prevMonthLikes) * 100 : 0;

        return {
            totalViews,
            totalLikes,
            currentMonthViews,
            currentMonthLikes,
            viewsGrowth: viewsGrowth.toFixed(1),
            likesGrowth: likesGrowth.toFixed(1),
        };
    }, [posts, monthlyStats]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <div className="flex items-center mt-2">
                        {parseFloat(stats.viewsGrowth) > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : parseFloat(stats.viewsGrowth) < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : (
                            <Activity className="h-4 w-4 text-gray-500 mr-1" />
                        )}
                        <p className={`text-sm ${parseFloat(stats.viewsGrowth) > 0 ? 'text-green-500' :
                            parseFloat(stats.viewsGrowth) < 0 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                            {stats.viewsGrowth}% from last month
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">This Month's Views</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.currentMonthViews.toLocaleString()}</div>
                    <div className="flex items-center mt-2">
                        <p className="text-sm text-gray-500">
                            {(stats.currentMonthViews / Math.max(1, stats.totalViews) * 100).toFixed(1)}% of all time
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
                    <div className="flex items-center mt-2">
                        {parseFloat(stats.likesGrowth) > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : parseFloat(stats.likesGrowth) < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : (
                            <Activity className="h-4 w-4 text-gray-500 mr-1" />
                        )}
                        <p className={`text-sm ${parseFloat(stats.likesGrowth) > 0 ? 'text-green-500' :
                            parseFloat(stats.likesGrowth) < 0 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                            {stats.likesGrowth}% from last month
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthorStats;