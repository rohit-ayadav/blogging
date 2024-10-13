"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calendar, ArrowRight, Eye, ThumbsUp, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import CountUp from 'react-countup';

interface BlogPostType {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    thumbnail?: string;
    views?: number;
    likes?: number;
    bio?: string;
}

interface UserType {
    email: string;
    name: string;
    image: string;
    bio: string;
    follower: number;
    following: number;
    noOfBlogs: number;
    createdAt: string;
    updatedAt: string;
    theme: string;
}

const BlogCollection = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPostType[]>([]);
    const [users, setUsers] = useState<{ [key: string]: UserType }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalViews, setTotalViews] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/blog');
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setPosts(data.data);
                setFilteredPosts(data.data);
                setTotalLikes(data.data.reduce((sum: number, post: BlogPostType) => sum + (post.likes || 0), 0));
                setTotalViews(data.data.reduce((sum: number, post: BlogPostType) => sum + (post.views || 0), 0));

                // Fetch user details
                const userEmails = data.data.map((post: BlogPostType) => post.createdBy);
                const uniqueEmails = [...new Set(userEmails)];
                const userDetails = await Promise.all(uniqueEmails.map(async (email) => {
                    const userResponse = await fetch(`/api/user?email=${email}`);
                    if (!userResponse.ok) {
                        throw new Error(`${userResponse.status} - ${userResponse.statusText}`);
                    }
                    const userData = await userResponse.json();
                    return { email, ...userData.user };
                }));

                const userMap = userDetails.reduce((acc, user) => {
                    acc[user.email] = user;
                    return acc;
                }, {});
                setUsers(userMap);
            } catch (error: any) {
                console.error('Error fetching blog data:', error);
                setError(error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const sorted = filtered.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'mostViews') return (b.views || 0) - (a.views || 0);
            if (sortBy === 'mostLikes') return (b.likes || 0) - (a.likes || 0);
            return 0;
        });

        setFilteredPosts(sorted);
    }, [posts, searchTerm, sortBy]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-2xl font-bold text-red-500 mb-4">Failed to load data</p>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                    Please check your internet connection and try again.
                </p>
                <Button onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <Toaster position="top-right" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold dark:text-white">Blog Posts</h1>
                    <Button onClick={toggleDarkMode} variant="outline" size="icon">
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center w-full sm:w-auto">
                        <Input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mr-2"
                        />
                        <Button size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center w-full sm:w-auto">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="mostViews">Most Views</SelectItem>
                                <SelectItem value="mostLikes">Most Likes</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="icon" className="ml-2">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                <CountUp end={posts.length} duration={2} />
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Views</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                <CountUp end={totalViews} duration={2} />
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Likes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                <CountUp end={totalLikes} duration={2} />
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                <CountUp end={Object.keys(users).length} duration={2} />
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(null).map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </CardContent>
                                <CardFooter>
                                    <Skeleton className="h-10 w-full" />
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        filteredPosts.map((post) => {
                            const user = users[post.createdBy];
                            return (
                                <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    {post.thumbnail && (
                                        <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" />
                                    )}
                                    <CardHeader>
                                        <CardTitle className="font-bold line-clamp-2">{post.title}</CardTitle>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="line-clamp-3 text-gray-600 dark:text-gray-300">{post.content.replace(/<[^>]+>/g, '')}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <Avatar>
                                                {user?.image ? (
                                                    <img src={user.image} alt={user?.name || 'User'} className="h-8 w-8 rounded-full" />
                                                ) : (
                                                    <AvatarFallback>{user?.name ? user.name[0] : 'U'}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <span className="text-sm font-medium">{user?.name || 'Unknown User'}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm font-medium">{post.views || 0}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm font-medium">{post.likes || 0}</span>
                                            </div>
                                        </div>
                                    </CardFooter>
                                    <CardFooter>
                                        <Link href={`/blogs/${post._id}`} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full">
                                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })
                    )}
                </div>
                {filteredPosts.length === 0 && !loading && (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No posts found. Try adjusting your search.</p>
                )}
            </div>
        </div>
    );
};

export default BlogCollection;