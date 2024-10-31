"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Tag, Eye, ThumbsUp, TrendingUp } from 'lucide-react'
import { Progress } from "@/components/ui/progress"


interface CategoryStats {
    category: string;
    count: number;
    totalViews: number;
    totalLikes: number;
}

interface Stats {
    categoryStats: CategoryStats[];
}

const CategoryOverview: React.FC<{ stats: Stats }> = ({ stats }) => {
    if (!stats || !stats.categoryStats || stats.categoryStats.length === 0) {
        return <div className="text-center p-4">No data available</div>
    }

    const totalPosts = stats.categoryStats.reduce((sum, stat) => sum + stat.count, 0)
    const totalViews = stats.categoryStats.reduce((sum, stat) => sum + stat.totalViews, 0)
    const totalLikes = stats.categoryStats.reduce((sum, stat) => sum + stat.totalLikes, 0)

    const getPercentage = (value: number, total: number) => ((value / total) * 100).toFixed(1)

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Overview</CardTitle>
                        <CardDescription>Detailed statistics for each category</CardDescription>
                    </CardHeader>
                    <ChartContainer
                        config={{
                            count: {
                                label: "Post Count",
                                color: "hsl(var(--chart-1))",
                            },
                            views: {
                                label: "Total Views",
                                color: "hsl(var(--chart-2))",
                            },
                            likes: {
                                label: "Total Likes",
                                color: "hsl(var(--chart-3))",
                            },
                        }}
                        className="h-[400px] max-w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.categoryStats}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="count" fill="var(--color-count)" name="Post Count" />
                                <Bar dataKey="totalViews" fill="var(--color-views)" name="Total Views" />
                                <Bar dataKey="totalLikes" fill="var(--color-likes)" name="Total Likes" />

                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>Overall statistics across all categories</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2" />
                            <span>Total Posts</span>
                        </div>
                        <span className="font-semibold">{totalPosts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Total Views</span>
                        </div>
                        <span className="font-semibold">{totalViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            <span>Total Likes</span>
                        </div>
                        <span className="font-semibold">{totalLikes}</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.categoryStats.map(stat => (
                    <Card key={stat.category}>
                        <CardHeader>
                            <CardTitle>{stat.category}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                        <Tag className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Posts</span>
                                    </div>
                                    <span>{stat.count}</span>
                                </div>
                                <Progress value={Number(getPercentage(stat.count, totalPosts))} className="h-2" />
                                <p className="text-xs text-right mt-1">{getPercentage(stat.count, totalPosts)}% of total</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                        <Eye className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Views</span>
                                    </div>
                                    <span>{stat.totalViews}</span>
                                </div>
                                <Progress value={Number(getPercentage(stat.totalViews, totalViews))} className="h-2" />
                                <p className="text-xs text-right mt-1">{getPercentage(stat.totalViews, totalViews)}% of total</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Likes</span>
                                    </div>
                                    <span>{stat.totalLikes}</span>
                                </div>
                                <Progress value={Number(getPercentage(stat.totalLikes, totalLikes))} className="h-2" />
                                <p className="text-xs text-right mt-1">{getPercentage(stat.totalLikes, totalLikes)}% of total</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Engagement Rate</span>
                                    </div>
                                    <span>{((stat.totalLikes / stat.totalViews) * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default CategoryOverview