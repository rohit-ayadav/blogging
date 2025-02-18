import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListIcon, TrendingUpIcon, PieChartIcon } from 'lucide-react'

interface StatsProps {
    totalStats: {
        totalBlogs: number;
        blogsThisMonth: number;
        totalViews: number;
        totalLikes: number;
    };
    chartData: { views: number; likes: number }[];
    engagementRate: number;
}

const Stats = ({ totalStats, chartData, engagementRate }: StatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                    <div className="h-4 w-4 text-indigo-600">
                        <ListIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStats.totalBlogs}</div>
                    <p className="text-xs text-muted-foreground">
                        +{totalStats.blogsThisMonth} this month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <div className="h-4 w-4 text-emerald-600">
                        <TrendingUpIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {chartData[chartData.length - 1]?.views || 0} views this month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    <div className="h-4 w-4 text-rose-600">
                        <TrendingUpIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStats.totalLikes.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {chartData[chartData.length - 1]?.likes || 0} likes this month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    <div className="h-4 w-4 text-amber-600">
                        <PieChartIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{engagementRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        Likes to views ratio
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Stats
