"use client";
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Moon, Sun, Search, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'react-hot-toast';
import DashboardGrid from '../component/dashboardGrid';
import BlogPostGrid from '../component/BlogPostGrid';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '@/types/blogs-types';
import debounce from 'lodash/debounce';
import { themeClasses } from './themeClass';
import { EmptyState, NoMorePosts, LoadingState } from './themeClass';
import { StatsType, BlogPostType, UserType } from '@/types/blogs-types';
import SubscriptionPopup from '../../components/SubscriptionPopup';

class DataCache<T> {
    private cache: Map<string, { data: T; timestamp: number }>;
    private readonly timeout: number;
    private readonly storageKey: string;

    constructor(timeoutMinutes: number, storageKey: string) {
        this.timeout = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds
        this.storageKey = storageKey;
        this.cache = new Map();
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        try {
            // Load cache from local storage on client side
            if (typeof window === 'undefined') return;
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.cache = new Map(Object.entries(data));
                this.clearExpired(); // Clean up on load
            }
        } catch (error) {
            console.warn('Failed to load cache from storage:', error);
            this.cache = new Map();
        }
    }

    private saveToStorage(): void {
        try {
            const data = Object.fromEntries(this.cache);
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save cache to storage:', error);
        }
    }

    async get(key: string, fetchFn: () => Promise<T>): Promise<T> {
        const entry = this.cache.get(key);
        const now = Date.now();

        // Check if cache is valid
        if (entry && now - entry.timestamp <= this.timeout) {
            return entry.data;
        }

        // If cache is invalid or missing, fetch new data
        try {
            const data = await fetchFn();
            this.set(key, data);
            return data;
        } catch (error) {
            // If fetch fails and we have expired cache, return expired data as fallback
            if (entry) {
                console.warn('Using expired cache as fallback');
                return entry.data;
            }
            throw error;
        }
    }

    set(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
        this.saveToStorage();
    }

    clear(): void {
        this.cache.clear();
        localStorage.removeItem(this.storageKey);
    }

    clearExpired(): void {
        const now = Date.now();
        let hasChanges = false;

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.timeout) {
                this.cache.delete(key);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            this.saveToStorage();
        }
    }
}

const postsCache = new DataCache<any>(5, 'blog-posts-cache');
const statsCache = new DataCache<StatsType>(15, 'blog-stats-cache'); // 15 minutes
const usersCache = new DataCache<Record<string, UserType>>(300, 'blog-users-cache'); // 5 hours

const BlogCollection = () => {
    const [state, setState] = useState({
        posts: [] as BlogPostType[],
        users: {} as Record<string, UserType>,
        loading: true,
        loadingMore: false,
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
        } as StatsType,
        metadata: {
            currentPage: 1,
            totalPages: 1,
            totalPosts: 0,
            hasMore: false,
            resultsPerPage: 9
        },
        statsLoading: true,
        initialized: false
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const isInitialMount = useRef(true);

    const fetchWithRetry = async (url: string, options?: RequestInit, retries = 3): Promise<Response> => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
        throw new Error('Failed after retries');
    };

    const fetchStats = useCallback(async () => {
        // if (!state.statsLoading) return;

        try {
            const statsData = await statsCache.get(`api/stats/${state.category}`, async () => {
                const response = await fetchWithRetry(`api/stats/${state.category}`, {
                    signal: abortControllerRef.current?.signal
                });
                return response.json();
            });

            setState(prev => ({
                ...prev,
                stats: statsData,
                statsLoading: false
            }));
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                toast.error('Failed to load statistics');
            }
        }
    }, [state.statsLoading, state.category]);

    // Improved fetch data with better error handling and caching
    const fetchData = useCallback(async (isInitialLoad = true, searchOverride?: string) => {
        try {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            setState(prev => ({
                ...prev,
                loading: isInitialLoad,
                loadingMore: !isInitialLoad,
                error: null
            }));

            const searchTerm = searchOverride ?? state.searchTerm;
            const queryParams = new URLSearchParams({
                page: state.page.toString(),
                limit: '9',
                category: state.category,
                sortBy: state.sortBy,
                ...(searchTerm && { search: searchTerm })
            });
            const url = `/api/blog?${queryParams}`;

            const cacheKey = url;
            const postsData = await postsCache.get(cacheKey, async () => {
                const response = await fetchWithRetry(url, {
                    signal: abortControllerRef.current?.signal
                });
                return response.json();
            });

            if (!postsData.success) {
                throw new Error('Failed to fetch blog posts');
            }

            interface PostsData {
                success: boolean;
                data: BlogPostType[];
                metadata: {
                    currentPage: number;
                    totalPages: number;
                    totalPosts: number;
                    hasMore: boolean;
                };
            }

            const newPosts: BlogPostType[] = isInitialLoad
                ? (postsData as PostsData).data
                : (postsData as PostsData).data.filter((newPost: BlogPostType) =>
                    !state.posts.some((existingPost: BlogPostType) => existingPost._id === newPost._id)
                );

            // Fetch user details with caching
            const userEmails = newPosts.map(post => post.createdBy);
            const uniqueEmails = Array.from(new Set(userEmails));
            const newUsers = await usersCache.get('users', async () => {
                const userDetails = await Promise.all(
                    uniqueEmails.map(email =>
                        fetchWithRetry(`/api/user?email=${email}`).then(res => res.json())
                    )
                );
                return userDetails.reduce((acc, response) => {
                    if (response?.user) {
                        acc[response.user.email] = response.user;
                    }
                    return acc;
                }, {} as Record<string, UserType>);
            });

            fetchStats();

            setState(prev => ({
                ...prev,
                posts: isInitialLoad ? newPosts : [...prev.posts, ...newPosts],
                users: { ...prev.users, ...newUsers },
                loading: false,
                loadingMore: false,
                metadata: postsData.metadata,
                initialized: true
            }));
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error(errorMessage);
            setState(prev => ({
                ...prev,
                loading: false,
                loadingMore: false,
                error: errorMessage
            }));
        }
    }, [state.page, state.category, state.sortBy, state.searchTerm, fetchStats]);

    // Initial data fetch
    useEffect(() => {
        if (!state.initialized) {
            fetchData(true);
        }
    }, [state.initialized, fetchData]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '200px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && !state.loading && !state.loadingMore && state.metadata.hasMore) {
                setState(prev => ({ ...prev, page: prev.page + 1 }));
            }
        }, options);

        const sentinel = document.getElementById('scroll-sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [state.loading, state.loadingMore, state.metadata.hasMore]);

    // Filter and sort changes
    useEffect(() => {
        if (!isInitialMount.current) {
            setState(prev => ({ ...prev, posts: [], page: 1 }));
            fetchData(true);
        } else {
            isInitialMount.current = false;
        }

        return () => {
            debouncedSearch.cancel();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [state.category, state.sortBy]);

    const debouncedSearch = useMemo(() => debounce((value: string) => {
        fetchData(true, value);
    }, 300), [fetchData]);

    const handleSearch = useCallback((value: string) => {
        setState(prev => ({ ...prev, searchTerm: value }));
        debouncedSearch(value);
    }, [debouncedSearch]);

    useEffect(() => {
        if (state.page > 1) {
            fetchData(false);
        }
    }, [state.page, fetchData]);

    const handleRetry = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            page: 1,
            statsLoading: true
        }));
        fetchData(true);
    }, [fetchData]);

    // if some error occurred
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
        <div className={`${themeClasses(isDarkMode).layout} transition-colors duration-200`}>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: isDarkMode ? '#1f2937' : '#ffffff',
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                    },
                    duration: 3000
                }}
            />

            <div className={themeClasses(isDarkMode).container}>
                {/* Header Section */}
                <div className={`${themeClasses(isDarkMode).header} sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <h1 className={themeClasses(isDarkMode).title}>Blog Posts</h1>
                    <Button
                        onClick={toggleDarkMode}
                        variant="outline"
                        size="icon"
                        className={`${themeClasses(isDarkMode).themeToggle} transition-colors duration-200`}
                    >
                        {isDarkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Controls Section */}
                <div className={`${themeClasses(isDarkMode).controls} grid grid-cols-1 md:grid-cols-3 gap-4`}>
                    <div className={`${themeClasses(isDarkMode).searchContainer} md:col-span-2`}>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search posts..."
                            value={state.searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className={`${themeClasses(isDarkMode).input} pl-10`}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <Select
                            value={state.category}
                            onValueChange={(value) => setState(prev => ({
                                ...prev,
                                category: value,
                                page: 1
                            }))}
                        >
                            <SelectTrigger className={themeClasses(isDarkMode).select}>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} max-h-60`}>
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
                            <SelectTrigger className={themeClasses(isDarkMode).select}>
                                <SelectValue placeholder="Sort" />
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
                </div>

                {/* Stats Section */}
                <DashboardGrid
                    totalBlogs={state.stats.totalBlogs}
                    totalViews={state.stats.totalViews}
                    totalLikes={state.stats.totalLikes}
                    totalUsers={state.stats.totalUsers}
                    loading={state.statsLoading}
                />

                {/* Posts Section */}
                <BlogPostGrid
                    filteredPosts={Array.from(new Set(state.posts.map(post => post._id)))
                        .map(id => state.posts.find(post => post._id === id))
                        .filter((post): post is BlogPostType => post !== undefined)}
                    users={state.users}
                    loading={state.loading}
                />

                {/* Loading State */}
                {state.loadingMore && <LoadingState message="Loading more posts..." />}
                {!state.loadingMore && !state.loading && !state.metadata.hasMore && <NoMorePosts />}
                {state.posts.length === 0 && !state.loading && <EmptyState />}

                {/* Scroll Sentinel */}
                <div id="scroll-sentinel" className="h-8" />
            </div>
        </div>
    );
}

export default BlogCollection;
