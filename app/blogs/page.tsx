"use client";
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Moon, Sun, Search, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'react-hot-toast';
import DashboardGrid from '../component/dashboardGrid';
import BlogPostGrid from '../component/BlogPostGrid';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '../component/BlogPostCard';
import debounce from 'lodash/debounce';

type BlogPostType = {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    thumbnail?: string;
    views?: number;
    likes?: number;
    category: string;
    score?: number;
};

type UserType = {
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
};

type StatsType = {
    totalLikes: number;
    totalViews: number;
    totalBlogs: number;
    totalUsers: number;
};

const BlogCollection = () => {
    const [state, setState] = useState({
        posts: [] as BlogPostType[],
        users: {} as Record<string, UserType>,
        loading: true,
        error: null as string | null,
        searchTerm: '',
        sortBy: 'newest',
        category: 'all',
        page: 1,
        stats: {
            totalLikes: 0,
            totalViews: 0,
            totalBlogs: 0,
            totalUsers: 0
        },
        metadata: {
            currentPage: 1,
            totalPages: 1,
            totalPosts: 0,
            hasMore: false,
            resultsPerPage: 9
        }
    });
    const { isDarkMode, toggleDarkMode } = useTheme();

    // Ensure posts array has unique IDs
    const uniquePosts = useMemo(() => {
        const seen = new Set();
        return state.posts.filter(post => {
            const duplicate = seen.has(post._id);
            seen.add(post._id);
            return !duplicate;
        });
    }, [state.posts]);

    const fetchWithErrorHandling = useCallback(async <T,>(
        url: string,
        options?: RequestInit
    ): Promise<T> => {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }, []);

    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm: string) => {
                setState(prev => ({ ...prev, page: 1, posts: [] })); // Clear posts when searching
                fetchData(true, searchTerm);
            }, 500),
        []
    );

    const fetchData = useCallback(async (isInitialLoad = false, searchOverride?: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const searchTerm = searchOverride ?? state.searchTerm;
            const queryParams = new URLSearchParams({
                page: state.page.toString(),
                limit: '9',
                category: state.category,
                sortBy: state.sortBy,
                ...(searchTerm && { search: searchTerm })
            });

            const [postsData, statsData] = await Promise.all([
                fetchWithErrorHandling<{
                    data: BlogPostType[];
                    metadata: typeof state.metadata;
                    success: boolean;
                }>(`/api/blog?${queryParams}`),
                fetchWithErrorHandling<StatsType>('/api/stats')
            ]);

            if (!postsData.success) {
                throw new Error('Failed to fetch blog posts');
            }

            // Ensure no duplicate posts are added
            const newPosts = postsData.data.filter(newPost =>
                isInitialLoad || !state.posts.some(existingPost => existingPost._id === newPost._id)
            );
            const newStatData = {
                totalLikes: postsData.data.reduce((acc, post) => acc + (post.likes || 0), 0),
                totalViews: postsData.data.reduce((acc, post) => acc + (post.views || 0), 0),
                totalBlogs: postsData.metadata.totalPosts,
                totalUsers: statsData.totalUsers
            }

            setState(prev => ({
                ...prev,
                posts: isInitialLoad ? newPosts : [...prev.posts, ...newPosts],
                users: { ...prev.users },
                loading: false,
                metadata: postsData.metadata,
                stats: (state.category === 'all' || state.sortBy === 'trending') ? state.stats : newStatData,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error(errorMessage);
            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage
            }));
        }
    }, [state.page, state.category, state.sortBy, state.searchTerm, fetchWithErrorHandling]);

    // Modified scroll handler
    useEffect(() => {
        const handleScroll = debounce(() => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const scrollThreshold = document.documentElement.scrollHeight - 200; // Add buffer

            if (
                scrollPosition >= scrollThreshold &&
                !state.loading &&
                state.metadata.hasMore
            ) {
                setState(prev => ({ ...prev, page: prev.page + 1 }));
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
        return () => {
            handleScroll.cancel();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [state.loading, state.metadata.hasMore]);
    useEffect(() => {
        setState(prev => ({ ...prev, posts: [], page: 1 })); 
        fetchData(true);
        return () => {
            debouncedSearch.cancel();
        };
    }, [state.category, state.sortBy]);
    const handleSearch = (value: string) => {
        setState(prev => ({ ...prev, searchTerm: value }));
        debouncedSearch(value);
    };

    useEffect(() => {
        if (state.page > 1) {
            fetchData(false);
        }
    }, [state.page, fetchData]);


    const handleLoadMore = useCallback(async () => {
        if (!state.loading && state.metadata.hasMore) {
            setState(prev => ({ ...prev, page: prev.page + 1 }));
            await fetchData();
        }
    }, [state.loading, state.metadata.hasMore, fetchData]);

    const handleRetry = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            page: 1
        }));
        fetchData(true);
    }, [fetchData]);

    const themeClasses = {
        layout: `min-h-screen transition-colors duration-300 ease-in-out
            ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`,
        container: 'container mx-auto px-4 py-8',
        header: 'flex justify-between items-center mb-8',
        title: `text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
        controls: 'mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        searchContainer: 'relative',
        input: `w-full rounded-lg border pl-10 ${isDarkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`,
        select: `w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`,
        themeToggle: `rounded-full p-2 ${isDarkMode
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`
    };

    if (state.error) {
        return (
            <div className={`flex flex-col justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className="text-2xl font-bold text-red-500 mb-4">Failed to load data</p>
                <Button
                    onClick={handleRetry}
                    className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} flex items-center gap-2`}
                >
                    <RefreshCcw className="h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className={themeClasses.layout}>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: isDarkMode ? '#1f2937' : '#ffffff',
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                    }
                }}
            />

            <div className={themeClasses.container}>
                <div className={themeClasses.header}>
                    <h1 className={themeClasses.title}>Blog Posts</h1>
                    <Button
                        onClick={toggleDarkMode}
                        variant="outline"
                        size="icon"
                        className={themeClasses.themeToggle}
                    >
                        {isDarkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                <div className={themeClasses.controls}>
                    <div className={themeClasses.searchContainer}>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search posts..."
                            value={state.searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className={themeClasses.input}
                        />
                    </div>

                    <Select
                        value={state.category}
                        onValueChange={(value) => setState(prev => ({
                            ...prev,
                            category: value,
                            page: 1
                        }))}
                    >
                        <SelectTrigger className={themeClasses.select}>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={state.sortBy}
                        onValueChange={(value) => setState(prev => ({
                            ...prev,
                            sortBy: value,
                            page: 1
                        }))}
                    >
                        <SelectTrigger className={themeClasses.select}>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="trending">Trending</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="mostViews">Most Views</SelectItem>
                            <SelectItem value="mostLikes">Most Likes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DashboardGrid
                    totalLikes={state.stats.totalLikes}
                    totalViews={state.stats.totalViews}
                    totalBlogs={state.stats.totalBlogs}
                    totalUsers={state.stats.totalUsers}
                    loading={state.loading}
                />

                <BlogPostGrid
                    loading={state.loading}
                    filteredPosts={uniquePosts}
                    users={state.users}
                    hasMore={state.metadata.hasMore}
                    onLoadMore={handleLoadMore}
                />
            </div>
        </div>
    );
};

export default React.memo(BlogCollection);