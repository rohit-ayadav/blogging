import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Line, LineChart } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface OverviewProps {
    chartData: { displayMonth: string; views: number; likes: number; blogs: number }[];
    categoryDistribution: { name: string; value: number }[];
    timeframe: string;
}

const Overview = ({ chartData, categoryDistribution, timeframe }: OverviewProps) => {
    // Function to determine if we should use abbreviated month names on smaller screens
    const getXAxisTickFormatter = (width: number) => {
        return (value: string) => width < 500 ? value.substring(0, 3) : value;
    };

    return (
        <div className="w-full space-y-6">
            <Card className="border-0 shadow-lg">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl">Performance Overview</CardTitle>
                    <CardDescription>
                        Views and likes over the past {timeframe === '6months' ? '6' : '12'} months
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="displayMonth"
                                    tick={{ fontSize: 12 }}
                                    height={30}
                                />
                                <YAxis
                                    width={45}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="views" stroke="#0088FE" name="Views" activeDot={{ r: 6 }} strokeWidth={2} />
                                <Line type="monotone" dataKey="likes" stroke="#00C49F" name="Likes" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="text-lg sm:text-xl">Category Distribution</CardTitle>
                        <CardDescription>
                            Breakdown of your blog posts by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <div className="h-66 sm:h-64">
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
                                    <Tooltip formatter={(value, name, props) => [`${value} posts`, `${props.payload.name}`]} />
                                    {/* <div className="absolute bottom-0 right-0"> */}
                                        <Legend />
                                    {/* </div> */}
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="text-lg sm:text-xl">Monthly Blog Publications</CardTitle>
                        <CardDescription>
                            Number of blogs published each month
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <div className="h-66 sm:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="displayMonth"
                                        tick={{ fontSize: 12 }}
                                        height={30}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        width={45}
                                        tick={{ fontSize: 12 }}
                                    />
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