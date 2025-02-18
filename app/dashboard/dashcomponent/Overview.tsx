import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Line, LineChart } from 'recharts'
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface OverviewProps {
    chartData: { displayMonth: string; views: number; likes: number; blogs: number }[];
    categoryDistribution: { name: string; value: number }[];
    // timeframe: '6months' | '12months';
    timeframe: string;
}
const Overview = ({ chartData, categoryDistribution, timeframe }: OverviewProps) => {
    return (
        <div>
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                        Views and likes over the past {timeframe === '6months' ? '6' : '12'} months
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="displayMonth" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="views" stroke="#0088FE" name="Views" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="likes" stroke="#00C49F" name="Likes" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                        <CardDescription>
                            Breakdown of your blog posts by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} posts`, 'Count']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Monthly Blog Publications</CardTitle>
                        <CardDescription>
                            Number of blogs published each month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="displayMonth" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip formatter={(value) => [`${value} blogs`, 'Publications']} />
                                    <Bar dataKey="blogs" fill="#8884d8" name="Blogs Published" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Overview