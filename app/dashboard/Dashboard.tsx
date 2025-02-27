"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserType, BlogPostType } from '@/types/blogs-types';
import Stats from './dashcomponent/Stats';
import Header from './dashcomponent/Header';
import Overview from './dashcomponent/Overview';
import Analytics from './dashcomponent/Analytics';
import BlogPost from './dashcomponent/BlogPost';
import { fetchAuthorData } from '@/action/personalDashboardData';
import AuthorStats from './AuthorStats';

interface AuthorDashboardProps {
    user: UserType;
    blogs: BlogPostType[];
    monthlyStats: {
        blog: string; month: string; views: number; likes: number
    }[];
}

function AuthorDashboard({ user, blogs, monthlyStats }: AuthorDashboardProps) {
    const [timeframe, setTimeframe] = useState('6months');
    const [sortBlogs, setSortBlogs] = useState('recent');
    const [selectedView, setSelectedView] = useState('overview');

    // Prepare data for charts
    const chartData = useMemo(() => {
        const months = [];
        const now = new Date();
        const monthCount = timeframe === '6months' ? 6 : 12;

        for (let i = 0; i < monthCount; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.unshift(monthStr);
        }

        // Aggregate stats by month
        const monthlyData = months.map(month => {
            const stats = monthlyStats.filter(stat => stat.month === month);
            const totalViews = stats.reduce((sum, stat) => sum + stat.views, 0);
            const totalLikes = stats.reduce((sum, stat) => sum + stat.likes, 0);

            return {
                month,
                displayMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                views: totalViews,
                likes: totalLikes,
                blogs: blogs.filter(blog => new Date(blog.createdAt).toISOString().startsWith(month)).length
            };
        });

        return monthlyData;
    }, [timeframe, monthlyStats, blogs]);

    // Get total stats
    const totalStats = useMemo(() => {
        const totalViews = monthlyStats.reduce((sum, stat) => sum + stat.views, 0);
        const totalLikes = monthlyStats.reduce((sum, stat) => sum + stat.likes, 0);
        const blogsThisMonth = blogs.filter(blog => {
            const now = new Date();
            const blogDate = new Date(blog.createdAt);
            return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
        }).length;

        return { totalViews, totalLikes, totalBlogs: blogs.length, blogsThisMonth };
    }, [blogs, monthlyStats]);

    // Category distribution for pie chart
    const categoryDistribution = useMemo(() => {
        const categories: { [key: string]: number } = {};
        blogs.forEach(blog => {
            if (!categories[blog.category]) categories[blog.category] = 0;
            categories[blog.category]++;
        });

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [blogs]);

    // Sort blogs for display
    const sortedBlogs = useMemo(() => {
        return [...blogs].sort((a, b) => {
            switch (sortBlogs) {
                case 'popular':
                    return (b.views || 0) - (a.views || 0);
                case 'liked':
                    return (b.likes || 0) - (a.likes || 0);
                default: // recent
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
    }, [blogs, sortBlogs]);

    // Calculate engagement rate
    const engagementRate = useMemo(() => {
        if (totalStats.totalViews === 0) return 0;
        return ((totalStats.totalLikes / totalStats.totalViews) * 100).toFixed(1);
    }, [totalStats]);

    return (
        <div className="w-full px-2 sm:px-4 py-4 sm:py-8 mx-auto max-w-7xl">
            <Header user={user} />
            <Stats totalStats={totalStats} chartData={chartData} engagementRate={parseFloat(engagementRate.toString())} />

            <div className="mt-6 sm:mt-8">
                <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <TabsList className="grid grid-cols-3 w-full max-w-md">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="blogs">My Blogs</TabsTrigger>
                            {/* <TabsTrigger value="author">Author</TabsTrigger> */}
                        </TabsList>

                        <Select value={timeframe} onValueChange={setTimeframe}>
                            <SelectTrigger className="w-full sm:w-[180px] mt-2 sm:mt-0">
                                <SelectValue placeholder="Timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6months">Last 6 Months</SelectItem>
                                <SelectItem value="12months">Last 12 Months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <TabsContent value="overview" className="mt-4 space-y-4 sm:space-y-8">
                        <Overview chartData={chartData} categoryDistribution={categoryDistribution} timeframe={timeframe} />
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-4 space-y-4 sm:space-y-6">
                        <Analytics blogs={blogs} monthlyStats={monthlyStats} chartData={chartData} sortedBlogs={sortedBlogs} />
                    </TabsContent>

                    <TabsContent value="blogs" className="mt-4 space-y-4 sm:space-y-6">
                        <div className="w-full overflow-x-auto">
                            <BlogPost
                                blogs={blogs}
                                monthlyStats={monthlyStats}
                                sortedBlogs={sortedBlogs}
                                sortBlogs={sortBlogs}
                                setSortBlogs={setSortBlogs}
                            />
                        </div>
                    </TabsContent>
                    {/* <TabsContent value="author" className="mt-4 space-y-4 sm:space-y-6">
                        <div className="w-full overflow-x-auto">
                            <AuthorStats posts={blogs} monthlyStats={monthlyStats} />
                        </div>
                    </TabsContent> */}
                </Tabs>
            </div>
        </div>
    );
}

export default AuthorDashboard;