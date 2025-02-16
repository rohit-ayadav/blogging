"use client";
import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'react-hot-toast';
import { Eye, ThumbsUp, Tag, Loader2, BarChart as BarChartIcon, Users, Mail, MessageSquare, Contact } from 'lucide-react';
import { Line, LineChart, PieChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInView } from 'react-intersection-observer';
import { ErrorBoundary } from 'react-error-boundary';
import ContactFormPage from './ContactFormPage';
import NewsLetterPage from './NewsLetterPage';
import NotificationTest from '@/components/NotificationTest/page';

const PostManagement = lazy(() => import('./PostManagement'));
const CategoryOverview = lazy(() => import('./CategoryOverview'));
const UserManagement = lazy(() => import('./UserManagement'));
const SystemSettings = lazy(() => import('./SystemSettings'));

interface CategoryStats {
    category: string;
    count: number;
    totalViews: number;
    totalLikes: number;
}

interface Stats {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    uncategorizedPosts: number;
    categoryStats: CategoryStats[];
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
    <div role="alert" className="p-4">
        <p className="font-bold">Something went wrong:</p>
        <pre className="mt-2 text-sm">{error.message}</pre>
        <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
);
interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subValue }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    return (
        <Card ref={ref}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
            </CardContent>
        </Card>
    );
};
interface LazyChartCardProps {
    title: string;
    description?: string;
    Chart: React.ComponentType<any>;
    data: any[];
    config: { [key: string]: { color: string } };
}

const LazyChartCard: React.FC<LazyChartCardProps> = ({ title, description, Chart, data, config }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    return (
        <Card ref={ref}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {inView ? (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <Chart data={data}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {Object.keys(config).map(key => (
                                    <Line
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={config[key].color}
                                    />
                                ))}
                            </Chart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const OptimizedAdminDashboard = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [savingPost, setSavingPost] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats>({
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        uncategorizedPosts: 0,
        categoryStats: []
    });
    const [userStats, setUserStats] = useState({ total: 0, newThisMonth: 0 });
    const [newsletterStats, setNewsletterStats] = useState({ total: 0, openRate: 0 });
    const [contactFormStats, setContactFormStats] = useState({ total: 0, unresolved: 0 });
    const [isSuperAdmin] = useState(true);
    const [contactUsDataPage, setcontactUsDataPage] = useState([]);
    const [newsLetterDataPage, setNewsLetterDataPage] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchPosts(),
                fetchAllData()
            ]);
            toast.success('Data fetched successfully');
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blog');
            const data = await response.json();
            setPosts(data.posts);
            setFilteredPosts(data.data);
            calculateStats(data.data);
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    };

    const fetchAllData = async () => {
        try {
            const [usersResponse, subscribersResponse, contactResponse] = await Promise.all([
                fetch('/api/user'),
                fetch('/api/subscribe'),
                fetch('/api/contact')
            ]);

            const [usersData, subscriberData, contactUsData] = await Promise.all([
                usersResponse.json(),
                subscribersResponse.json(),
                contactResponse.json()
            ]);
            setNewsletterStats({
                total: subscriberData.subscribers.length,
                openRate: parseFloat(calculateOpenRate(subscriberData.subscribers))
            });

            setContactFormStats({
                total: contactUsData.data.length,
                unresolved: contactUsData.data.filter((c: { resolved: boolean }) => !c.resolved).length
            });
            setcontactUsDataPage(contactUsData.data);
            setNewsLetterDataPage(subscriberData.subscribers);

        } catch (error) {
            console.error('Error fetching additional data:', error);
            throw new Error('Failed to fetch data');
        }
    };

    const calculateOpenRate = useCallback((subscribers: { openedEmails: number }[]) => {
        const openedEmails = subscribers.filter(s => s.openedEmails > 0).length;
        return ((openedEmails / subscribers.length) * 100).toFixed(2);
    }, []);

    interface Post {
        _id: string;
        title: string;
        createdBy: string;
        createdAt: string;
        views?: number;
        likes?: number;
        category?: string;
    }

    interface CategoryMapValue {
        category: string;
        count: number;
        totalViews: number;
        totalLikes: number;
    }

    const calculateStats = useCallback((postsData: Post[]) => {
        const categoryMap = new Map<string, CategoryMapValue>();
        let totalViews = 0;
        let totalLikes = 0;
        let uncategorizedPosts = 0;

        postsData.forEach(post => {
            totalViews += post.views || 0;
            totalLikes += post.likes || 0;

            if (!post.category) {
                uncategorizedPosts++;
                return;
            }

            const currentStats = categoryMap.get(post.category) || {
                category: post.category,
                count: 0,
                totalViews: 0,
                totalLikes: 0
            };

            categoryMap.set(post.category, {
                ...currentStats,
                count: currentStats.count + 1,
                totalViews: currentStats.totalViews + (post.views || 0),
                totalLikes: currentStats.totalLikes + (post.likes || 0)
            });
        });

        setStats({
            totalPosts: postsData.length,
            totalViews,
            totalLikes,
            uncategorizedPosts,
            categoryStats: Array.from(categoryMap.values())
        });
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(value.toLowerCase()) ||
            post.createdBy.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPosts(filtered);
    }, [posts]);

    const updateCategory = async (postId: string, category: string, posts: Post[]) => {
        try {
            setSavingPost(postId);
            const response = await fetch(`/api/blog/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`${response.status} - ${errorData.message}`)
            }
            const data = await response.json()
            const updatedPosts = posts.map(post =>
                post._id === postId ? { ...post, category } : post
            )
            setPosts(updatedPosts)
            setFilteredPosts(updatedPosts)
            calculateStats(updatedPosts)

            toast.success(data.message)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`${error.message}`)
            } else {
                toast.error('An unknown error occurred')
            }
            console.error(error)
        } finally {
            setSavingPost(null)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Button onClick={fetchData}>Refresh All Data</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Posts"
                    value={stats.totalPosts}
                    icon={Tag}
                    subValue={`${stats.uncategorizedPosts} uncategorized`}
                />
                <StatCard
                    title="Total Views"
                    value={stats.totalViews.toLocaleString()}
                    icon={Eye}
                />
                <StatCard
                    title="Total Likes"
                    value={stats.totalLikes.toLocaleString()}
                    icon={ThumbsUp}
                />
                <StatCard
                    title="Categories"
                    value={stats.categoryStats.length}
                    icon={BarChartIcon}
                />
            </div>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="flex flex-wrap gap-2 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                        <TabsTrigger value="contact">Contact Form</TabsTrigger>
                        <TabsTrigger value="notification">Notification</TabsTrigger>
                        {isSuperAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LazyChartCard
                                title="Views Over Time"
                                Chart={LineChart}
                                data={[
                                    { date: "Jan", views: 100 },
                                    { date: "Feb", views: 300 },
                                    { date: "Mar", views: 200 },
                                    { date: "Apr", views: 500 },
                                    { date: "May", views: 400 },
                                    { date: "Jun", views: 700 },
                                ]}
                                config={{
                                    views: {
                                        color: "hsl(215, 70%, 50%)"
                                    }
                                }}
                            />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[300px]">
                                        {posts.length !== 0 && posts.slice(0, 10).map((post) => (
                                            <div key={post._id} className="flex items-center mb-4 last:mb-0">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={`default-profile.jpg`} alt={post.createdBy} />
                                                    <AvatarFallback>{post.createdBy.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{post.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Posted by {post.createdBy} on {new Date(post.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="ml-auto">
                                                    {post.category || 'Uncategorized'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="posts">
                        <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                            <PostManagement
                                posts={filteredPosts}
                                loading={loading}
                                searchTerm={searchTerm}
                                handleSearch={handleSearch}
                                updateCategory={(postId, value) => updateCategory(postId, value, posts)}
                                savingPost={savingPost}
                            />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="categories">
                        <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                            <CategoryOverview stats={stats} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="users">
                        <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                            <UserManagement />
                        </Suspense>
                    </TabsContent>

                    {isSuperAdmin && (
                        <TabsContent value="settings">
                            <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                                <SystemSettings />
                            </Suspense>
                        </TabsContent>
                    )}

                    <TabsContent value="newsletter">
                        <NewsLetterPage subscribers={newsLetterDataPage} />
                    </TabsContent>

                    <TabsContent value="contact">
                        <ContactFormPage data={contactUsDataPage} />
                    </TabsContent>
                    <TabsContent value="notification">
                        <NotificationTest />
                    </TabsContent>
                </Tabs>
            </ErrorBoundary>
        </div>
    );
};

export default OptimizedAdminDashboard;