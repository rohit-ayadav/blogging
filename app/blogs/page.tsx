"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'react-hot-toast';
import DashboardGrid from '../component/dashboardGrid';
import BlogPostGrid from '../component/BlogPostGrid';
import { useTheme } from '@/context/ThemeContext';

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
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPostType[]>([]);
    const [users, setUsers] = useState<{ [key: string]: UserType }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalViews, setTotalViews] = useState(0);

    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {

        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

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

    const copyMessage = "${post.title}\n${post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}\n\nRead more at: ${window.location.href}";


    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
        <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: isDarkMode ? '#333' : '#fff',
                    color: isDarkMode ? '#fff' : '#333',
                },
            }} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Blog Posts</h1>
                    <Button onClick={toggleDarkMode} variant="outline" size="icon" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center w-full sm:w-auto">
                        <Input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mr-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        />
                        <Button size="icon" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center w-full sm:w-auto">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="mostViews">Most Views</SelectItem>
                                <SelectItem value="mostLikes">Most Likes</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="icon" className="ml-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <DashboardGrid posts={posts.map(post => ({ ...post, views: post.views || 0, likes: post.likes || 0 }))} totalViews={totalViews} totalLikes={totalLikes} users={users} />
            </div>

            <BlogPostGrid filteredPosts={filteredPosts} users={users} loading={loading} />
        </div>
    );
};

export default BlogCollection;