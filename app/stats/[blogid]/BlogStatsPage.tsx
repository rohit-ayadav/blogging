"use client";
import React, { useMemo, useState } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp, Users, ThumbsUp, Clock, AlertCircle,
    Calendar, Eye, Share2, ArrowUpRight, Edit, Trash2,
    ExternalLink, Download, Filter, UserCircle
} from 'lucide-react';
import { formatDate } from '@/utils/date-formatter';
import { BlogPostType, MonthlyStatsType, UserType } from '@/types/blogs-types';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StatCard = ({ title, value, icon: Icon, trend, description }: any) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 ${Number(trend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <ArrowUpRight className={`h-4 w-4 ${Number(trend) < 0 ? 'rotate-90' : ''}`} />
                        <span className="text-sm">{Math.abs(Number(trend))}%</span>
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
        </CardContent>
    </Card>
);

const AuthorCard = ({ user }: { user: UserType }) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
                <img
                    src={user.image || "/api/placeholder/40/40"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                />
                <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.bio}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm">
                            <strong>{user.noOfBlogs}</strong> posts
                        </span>
                        <span className="text-sm">
                            <strong>{user.follower}</strong> followers
                        </span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const TIME_PERIODS = {
    '1M': 'This Month',
    '3M': 'Last 3 Months',
    '6M': 'Last 6 Months',
    '1Y': 'Last Year',
    'ALL': 'All Time'
};

const BlogStatsPage = ({ user, data, monthlyStats }: { user: UserType, data: BlogPostType, monthlyStats: MonthlyStatsType[] }) => {
    const { isDarkMode } = useTheme();
    const [timePeriod, setTimePeriod] = useState('3M');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const filteredStats = useMemo(() => {
        const now = new Date();
        const months = {
            '1M': 1,
            '3M': 3,
            '6M': 6,
            '1Y': 12,
            'ALL': Infinity
        }[timePeriod];

        const cutoffDate = new Date(now.getFullYear(), now.getMonth() - (months || 0), 1);
        return monthlyStats.filter(stat => new Date(stat.month) >= cutoffDate);
    }, [monthlyStats, timePeriod]);

    const processedStats = useMemo(() => {
        return filteredStats.map(stat => ({
            ...stat,
            month: formatDate(stat.month),
            engagement: ((stat.likes / stat.views) * 100).toFixed(1)
        }));
    }, [filteredStats]);

    const totalStats = useMemo(() => {
        return filteredStats.reduce((acc, curr) => ({
            views: acc.views + curr.views,
            likes: acc.likes + curr.likes
        }), { views: 0, likes: 0 });
    }, [filteredStats]);

    const monthlyGrowth = useMemo(() => {
        if (filteredStats.length < 2) return 0;
        const lastMonth = filteredStats[filteredStats.length - 1];
        const previousMonth = filteredStats[filteredStats.length - 2];
        return (((lastMonth.views - previousMonth.views) / previousMonth.views) * 100).toFixed(1);
    }, [filteredStats]);

    const handleExportData = () => {
        const csvContent = [
            ['Month', 'Views', 'Likes', 'Engagement Rate'],
            ...processedStats.map(stat => [
                stat.month,
                stat.views,
                stat.likes,
                stat.engagement
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.title}-stats.csv`;
        a.click();
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header Section with Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{data.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Published on {formatDate(new Date(data.createdAt))}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/blogs/${data.slug}`}>
                        <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Blog
                        </Button>
                    </Link>
                    <Link href={`/edit/${data.slug}`}>
                        <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your blog
                                    and remove all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    Delete Blog
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Author Info */}
            <AuthorCard user={user} />

            {/* Filter and Export Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(TIME_PERIODS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Views"
                    value={totalStats.views.toLocaleString()}
                    icon={Eye}
                    trend={monthlyGrowth}
                    description="Views this period"
                />
                <StatCard
                    title="Total Likes"
                    value={totalStats.likes.toLocaleString()}
                    icon={ThumbsUp}
                    description="Engagement indicator"
                />
                <StatCard
                    title="Avg. Engagement Rate"
                    value={`${((totalStats.likes / totalStats.views) * 100).toFixed(1)}%`}
                    icon={Users}
                    description="Likes per view"
                />
                <StatCard
                    title="Days Published"
                    value={Math.ceil((Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    icon={Calendar}
                    description="Total active days"
                />
            </div>

            {/* Views Trend */}
            <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>Views Trend</CardTitle>
                </CardHeader>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedStats}>
                            <defs>
                                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#3B82F6"
                                fillOpacity={1}
                                fill="url(#viewsGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Likes Over Time */}
                <Card className="p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Likes Over Time</CardTitle>
                    </CardHeader>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={processedStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="likes"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Engagement Rate */}
                <Card className="p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Monthly Engagement Rate</CardTitle>
                    </CardHeader>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processedStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis unit="%" />
                                <Tooltip />
                                <Bar
                                    dataKey="engagement"
                                    fill="#8B5CF6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Blog Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="flex items-center text-gray-600 dark:text-gray-300">
                                <Calendar className="h-4 w-4 mr-2" />
                                Published: {formatDate(new Date(data.createdAt))}
                            </p>
                            <p className="flex items-center text-gray-600 dark:text-gray-300">
                                <Clock className="h-4 w-4 mr-2" />
                                Last Updated: {formatDate(new Date(data?.updatedAt ?? data.createdAt))}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="flex items-center text-gray-600 dark:text-gray-300">
                                <Share2 className="h-4 w-4 mr-2" />
                                Category: {data.category}
                            </p>
                            <div className="flex items-center space-x-2">
                                {data.tags?.slice(0, 5).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>

            </Card>
        </div>
    );
}

export default BlogStatsPage;