'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import toast from 'react-hot-toast'

interface Subscriber {
    email: string;
    createdAt: string;
    status: string;
}

interface NewsletterAdminPageProps {
    subscribers: Subscriber[];
}

export default function NewsletterAdminPage({ subscribers }: NewsletterAdminPageProps) {
    const [emailContent, setEmailContent] = useState('')
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
    const [subscriberGrowth, setSubscriberGrowth] = useState<{ month: string; subscribers: number }[]>([])


    const findSubscriberGrowth = () => {
        const growth: { [key: string]: number } = {};

        subscribers.forEach(subscriber => {
            const month = new Date(subscriber.createdAt).toLocaleString('default', { month: 'short' });
            if (!growth[month]) {
                growth[month] = 0;
            }
            growth[month]++;
        });

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const growthArray = months.map(month => ({
            month,
            subscribers: growth[month] || 0
        }));

        return growthArray;
    };

    // Usage in useEffect
    useEffect(() => {
        setSubscriberGrowth(findSubscriberGrowth());
    }, [subscribers]);

    const engagementRate = [
        { week: 'Week 1', rate: 65 },
        { week: 'Week 2', rate: 68 },
        { week: 'Week 3', rate: 72 },
        { week: 'Week 4', rate: 75 },
    ]

    const handleSendEmail = () => {
        // Logic to send email to selected subscribers
        toast.success('Email sent successfully!')
    }

    const toggleSubscriberSelection = (email: string) => {
        setSelectedSubscribers(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        )
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Newsletter Admin Dashboard</h1>

            <Tabs defaultValue="subscribers" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="email">Compose Email</TabsTrigger>
                </TabsList>

                <TabsContent value="subscribers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscriber List</CardTitle>
                            <CardDescription>Manage your newsletter subscribers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Select</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Joined Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscribers.map((subscriber) => (
                                        <TableRow key={subscriber.email}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubscribers.includes(subscriber.email)}
                                                    onChange={() => toggleSubscriberSelection(subscriber.email)}
                                                />
                                            </TableCell>
                                            <TableCell>{subscriber.email}</TableCell>
                                            <TableCell>{subscriber.createdAt.slice(0, 10)}</TableCell>
                                            <TableCell>{"Subscribed"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-7 lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Subscriber Growth</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        subscribers: {
                                            label: "Subscribers",
                                            color: "hsl(var(--chart-1))",
                                        },
                                    }}
                                    className="h-[200px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={subscriberGrowth}>
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Line type="monotone" dataKey="subscribers" stroke="var(--color-subscribers)" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-7 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Engagement Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        rate: {
                                            label: "Engagement Rate",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[200px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={engagementRate}>
                                            <XAxis dataKey="week" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="rate" fill="var(--color-rate)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compose Weekly Newsletter</CardTitle>
                            <CardDescription>Create and send your weekly newsletter</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="Weekly Newsletter: Top 7 Posts" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-content">Email Content</Label>
                                    <Textarea
                                        id="email-content"
                                        placeholder="Enter your email content here..."
                                        value={emailContent}
                                        onChange={(e) => setEmailContent(e.target.value)}
                                        className="min-h-[300px]"
                                    />
                                </div>
                                <Button onClick={handleSendEmail}>Send Email</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}