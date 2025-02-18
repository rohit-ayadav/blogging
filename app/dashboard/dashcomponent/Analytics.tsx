import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { BlogPostType } from '@/types/blogs-types'

interface AnalyticsProps {
    blogs: BlogPostType[];
    monthlyStats: { blog: string; month: string; views: number; likes: number }[];
    chartData: { views: number; likes: number }[];
    sortedBlogs: BlogPostType[];
}

const Analytics = ({ blogs, monthlyStats, chartData, sortedBlogs }: AnalyticsProps) => {
    return (
        <div>
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Monthly Engagement Metrics</CardTitle>
                    <CardDescription>
                        Detailed breakdown of views, likes, and engagement rates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="displayMonth" />
                                <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                                <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="views" fill="#0088FE" name="Views" />
                                <Bar yAxisId="right" dataKey="likes" fill="#00C49F" name="Likes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>
                        Your most viewed and liked blog posts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Likes</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engagement</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedBlogs.slice(0, 5).map((blog) => {
                                    const blogStats = monthlyStats.filter(stat => new Date(blog.createdAt).toISOString().startsWith(stat.month));
                                    const totalViews = blogStats.reduce((sum, stat) => sum + stat.views, 0);
                                    const totalLikes = blogStats.reduce((sum, stat) => sum + stat.likes, 0);
                                    const engagement = totalViews ? ((totalLikes / totalViews) * 100).toFixed(1) : 0;

                                    return (
                                        <tr key={blog._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{blog.title}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant="outline" className="capitalize">
                                                    {blog.category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{totalViews.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{totalLikes.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${Number(engagement) > 5 ? 'text-green-600 dark:text-green-400' :
                                                    Number(engagement) > 2 ? 'text-amber-600 dark:text-amber-400' :
                                                        'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {engagement}%
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Analytics