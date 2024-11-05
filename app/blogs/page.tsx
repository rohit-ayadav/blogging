"use client";
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Moon, Sun, Search, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'react-hot-toast';
import DashboardGrid from '../component/dashboardGrid';
import BlogPostGrid from '../component/BlogPostGrid';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '../component/BlogPostCard';
import debounce from 'lodash/debounce';
import { themeClasses } from './themeClass';
import { BlogPostType, UserType, StatsType, EmptyState, NoMorePosts, LoadingState } from './themeClass';

// Cache implementation with type safety
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class DataCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private readonly timeout: number;

    constructor(timeoutMinutes: number) {
        this.timeout = timeoutMinutes * 60 * 1000;
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.timestamp > this.timeout) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }

    set(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    clear(): void {
        this.cache.clear();
    }

    clearExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.timeout) {
                this.cache.delete(key);
            }
        }
    }
}



const postsCache = new DataCache<any>(5); // 5 minutes cache
const statsCache = new DataCache<StatsType>(15); // 15 minutes cache for stats



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
        statsLoading: true
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const isInitialMount = useRef(true);

    // Memoized unique posts
    const uniquePosts = useMemo(() => {
        const postMap = new Map();
        state.posts.forEach(post => {
            if (!postMap.has(post._id)) {
                postMap.set(post._id, post);
            }
        });
        return Array.from(postMap.values());
    }, [state.posts]);

    // Optimized fetch with caching
    const cachedFetch = useCallback(async <T,>(
        url: string,
        options?: RequestInit,
        cacheInstance?: DataCache<T>
    ): Promise<T> => {
        if (cacheInstance) {
            const cachedData = cacheInstance.get(url);
            if (cachedData) return cachedData;
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (cacheInstance) {
            cacheInstance.set(url, data);
        }
        return data;
    }, []);

    // In your component, call clearExpired periodically or when the search/filter changes
    useEffect(() => {
        const interval = setInterval(() => {
            postsCache.clearExpired();
            statsCache.clearExpired();
        }, 60 * 1000); // Clear expired entries every 1 minute

        return () => clearInterval(interval);
    }, []);

    // Fetch stats separately with its own loading state
    const fetchStats = useCallback(async () => {
        if (!state.statsLoading) return;

        try {
            const statsData = await cachedFetch<StatsType>(
                '/api/stats',
                { signal: abortControllerRef.current?.signal },
                statsCache
            );

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
    }, [state.statsLoading, cachedFetch]);

    // Optimized search with abort controller
    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm: string) => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                setState(prev => ({ ...prev, page: 1, posts: [] }));
                fetchData(true, searchTerm);
            }, 300),
        []
    );

    const fetchData = useCallback(async (isInitialLoad = false, searchOverride?: string) => {
        try {
            // Abort any ongoing requests
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            // Update state to show loading
            setState(prev => ({
                ...prev,
                loading: isInitialLoad,
                loadingMore: !isInitialLoad,
                error: null
            }));

            // Construct the API URL with query parameters
            const searchTerm = searchOverride ?? state.searchTerm;
            const queryParams = new URLSearchParams({
                page: state.page.toString(),
                limit: '9',
                category: state.category,
                sortBy: state.sortBy,
                ...(searchTerm && { search: searchTerm })
            });
            const url = `/api/blog?${queryParams}`;

            // Fetch the data, using the cache if possible
            const postsData = await cachedFetch<{
                data: BlogPostType[];
                metadata: typeof state.metadata;
                success: boolean;
            }>(url, { signal: abortControllerRef.current.signal }, postsCache);

            // Handle errors
            if (!postsData.success) {
                throw new Error('Failed to fetch blog posts');
            }

            // Filter out existing posts for incremental loads
            const newPosts = isInitialLoad
                ? postsData.data
                : postsData.data.filter(newPost =>
                    !state.posts.some(existingPost => existingPost._id === newPost._id)
                );

            // Fetch user details for new posts
            const userEmails = newPosts.map(post => post.createdBy);
            const uniqueEmails = Array.from(new Set(userEmails));
            const userDetails = await Promise.all(
                uniqueEmails.map(email =>
                    cachedFetch<{ user: UserType }>(`/api/user?email=${email}`)
                )
            );
            const newUsers = userDetails.reduce((acc, response) => {
                if (response?.user) {
                    acc[response.user.email] = response.user;
                }
                return acc;
            }, {} as Record<string, UserType>);

            // // Update stats
            fetchStats();

            // Update the state
            setState(prev => ({
                ...prev,
                posts: isInitialLoad ? newPosts : [...prev.posts, ...newPosts],
                users: { ...prev.users, ...newUsers },
                loading: false,
                loadingMore: false,
                metadata: postsData.metadata,
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
    }, [state.page, state.category, state.sortBy, state.searchTerm, cachedFetch, fetchStats]);
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
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"> */}
                <DashboardGrid
                    totalBlogs={state.stats.totalBlogs}
                    totalViews={state.stats.totalViews}
                    totalLikes={state.stats.totalLikes}
                    totalUsers={state.stats.totalUsers}
                    loading={state.statsLoading}
                />
                {/* </div> */}

                {/* Posts Section */}
                <BlogPostGrid
                    filteredPosts={uniquePosts}
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
