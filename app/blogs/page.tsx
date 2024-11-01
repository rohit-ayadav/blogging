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
import { CATEGORIES } from '../component/BlogPostCard';

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
    category: string;
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
    const [category, setCategory] = useState('all');
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalAuthors, setTotalAuthors] = useState(0);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [page, setPage] = useState(1);
    const [loading1, setLoading1] = useState(true);
    const [POSTS_PER_PAGE, setPOSTS_PER_PAGE] = useState(6);
    const [totalUsers, setTotalUsers] = useState(0);

    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const [fetchedUsers, setFetchedUsers] = useState<Set<string>>(new Set());

    const fetchUserDetails = async (emails: string[]) => {
        // Filter out emails we've already fetched
        const newEmails = emails.filter(email => !fetchedUsers.has(email));

        if (newEmails.length === 0) return {};

        const userDetails = await Promise.all(
            newEmails.map(async (email) => {
                const userResponse = await fetch(`/api/user?email=${email}`);
                if (!userResponse.ok) {
                    throw new Error(`${userResponse.status} - ${userResponse.statusText}`);
                }
                const userData = await userResponse.json();
                return { email, ...userData.user };
            })
        );

        // Add new emails to fetchedUsers set
        setFetchedUsers(prev => new Set([...prev, ...newEmails]));

        return userDetails.reduce((acc, user) => {
            acc[user.email] = user;
            return acc;
        }, {});
    };

    const fetchPosts = async (pageNumber: number) => {
        try {
            setError(null);
            setLoading(pageNumber === 1);

            const response = await fetch(`/api/blog?page=${pageNumber}&limit=${POSTS_PER_PAGE}`);
            if (!response.ok) {
                throw new Error(`${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const newPosts = data.data;
            setPOSTS_PER_PAGE(9);

            // Update hasMore based on whether we received a full page of posts
            setHasMore(newPosts.length === POSTS_PER_PAGE);

            // Get user details for new posts
            const userEmails = newPosts.map((post: BlogPostType) => post.createdBy);
            const newUserDetails = await fetchUserDetails(userEmails);

            // Update users state with new user details
            setUsers(prev => ({ ...prev, ...newUserDetails }));

            // Update posts
            if (pageNumber === 1) {
                setPosts(newPosts);
                setFilteredPosts(newPosts);
                // Reset totals for first page
                // setTotalLikes(newPosts.reduce((sum: number, post: BlogPostType) => sum + (post.likes || 0), 0));
                // setTotalViews(newPosts.reduce((sum: number, post: BlogPostType) => sum + (post.views || 0), 0));
            } else {
                setPosts(prev => {
                    const updatedPosts = [...prev, ...newPosts];
                    // Update totals with new posts
                    // setTotalLikes(updatedPosts.reduce((sum: number, post: BlogPostType) => sum + (post.likes || 0), 0));
                    // setTotalViews(updatedPosts.reduce((sum: number, post: BlogPostType) => sum + (post.views || 0), 0));
                    return updatedPosts;
                });
                setFilteredPosts(prev => [...prev, ...newPosts]);
            }

        } catch (error: any) {
            console.error('Error fetching blog data:', error);
            setError(error.message);
            toast.error(error.message);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            setLoading1(true);
            setError(null);
            const response = await fetch('/api/stats');
            if (!response.ok) {
                throw new Error(`${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setTotalLikes(data.totalLikes);
            setTotalViews(data.totalViews);
            setTotalBlogs(data.totalBlogs);
            setTotalUsers(data.totalUsers);
            
        } catch (error: any) {
            console.error('Error fetching stats:', error);
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading1(false);
        }
    };

    const loadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchPosts(nextPage);
    };

    // Initial load
    useEffect(() => {
        fetchPosts(1);
        fetchStats();
    }, []);

    useEffect(() => {
        let filtered = posts;

        // Apply category filter
        if (category !== 'all') {
            filtered = filtered.filter(post => post.category === category);
        }

        // Apply search filter
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'mostViews') return (b.views || 0) - (a.views || 0);
            if (sortBy === 'mostLikes') return (b.likes || 0) - (a.likes || 0);
            return 0;
        });

        setFilteredPosts(sorted);
    }, [posts, searchTerm, sortBy, category]);

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

    const handleLoadMore = async () => {
        await loadMore();
    };

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

                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center w-full">
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

                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="mostViews">Most Views</SelectItem>
                            <SelectItem value="mostLikes">Most Likes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DashboardGrid
                    totalBlogs={totalBlogs}
                    totalLikes={totalLikes}
                    totalViews={totalViews}
                    totalUsers={totalUsers}
                    loading={loading1}
                />
            </div>

            <BlogPostGrid
                loading={loading}
                filteredPosts={posts}
                users={users}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
};

export default BlogCollection;