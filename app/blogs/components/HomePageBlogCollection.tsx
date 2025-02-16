import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sun, Moon, Search, RefreshCcw, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, stateType, StatsType } from '@/types/blogs-types';
import { BlogPostType, UserType } from '@/types/blogs-types';
import { Toaster } from '@/components/ui/toaster';
import DashboardGrid from '@/app/_component/dashboardGrid';
import BlogPostGrid from '@/app/_component/BlogPostGrid';
import { Button } from '@/components/ui/button';
import { EmptyState, LoadingState, NoMorePosts, themeClasses } from '../themeClass';
import { useTheme } from '@/context/ThemeContext';


interface HomePageBlogCollectionProps {
    state: stateType;
    handleRetry: () => void;
    setState: React.Dispatch<React.SetStateAction<stateType>>;
    searchLoading: boolean;
}

const HomePageBlogCollection = ({ state, handleRetry, setState, searchLoading }: HomePageBlogCollectionProps) => {
    const { isDarkMode, toggleDarkMode } = useTheme();

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
        <TooltipProvider>
            <div className={`${themeClasses(isDarkMode).layout} transition-colors duration-200`}>
                <Toaster />

                <div className={themeClasses(isDarkMode).container}>
                    {/* Header Section */}
                    <div className={`${themeClasses(isDarkMode).header} sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <h1 className={themeClasses(isDarkMode).title}>Blog Posts</h1>
                        <div
                            onClick={toggleDarkMode}
                            className={`${themeClasses(isDarkMode).themeToggle} transition-colors duration-200`}
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className={`${themeClasses(isDarkMode).controls} grid grid-cols-1 md:grid-cols-3 gap-4`}>
                        <div className={`relative md:col-span-2 ${themeClasses(isDarkMode).searchContainer}`}>
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                aria-hidden="true"
                            />

                            <Input
                                type="text"
                                placeholder="Search posts..."
                                value={state.searchTerm}
                                onChange={(e) => {
                                    setState(prev => ({
                                        ...prev,
                                        searchTerm: e.target.value,
                                        page: 1
                                    }));
                                }}
                                className={`pl-10 pr-8 ${themeClasses(isDarkMode).input}`}
                                aria-label="Search blog posts"
                            />

                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                {state.searchTerm && (
                                    <>
                                        {state.loading ? (
                                            <Loader2
                                                className="h-4 w-4 animate-spin text-gray-400"
                                                aria-label="Searching posts"
                                            />
                                        ) : (
                                            <span
                                                onClick={() => {
                                                    setState(prev => ({
                                                        ...prev,
                                                        searchTerm: '',
                                                        page: 1
                                                    }));
                                                }}
                                                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                aria-label="Clear search"
                                            >
                                                <X className="h-4 w-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
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
                                <Tooltip>
                                    <TooltipTrigger>
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
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span className="text-xs">Filter by category</span>
                                    </TooltipContent>
                                </Tooltip>
                            </Select>

                            <Select
                                value={state.sortBy}
                                onValueChange={(value) => setState(prev => ({
                                    ...prev,
                                    sortBy: value,
                                    page: 1
                                }))}
                            >
                                <Tooltip>
                                    <TooltipTrigger>
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
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span className="text-xs">Sort the posts</span>
                                    </TooltipContent>
                                </Tooltip>
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
                        filteredPosts={
                            Array.from(new Set(state.posts.map(post => post._id))) // Get unique post ids
                                .map(id => state.posts.find(post => post._id === id)) // Remove duplicates
                                .filter((post): post is BlogPostType => post !== undefined) // Filter out undefined values
                        }
                        users={state.users}
                        loading={state.loading}
                    />

                    {/* Loading State */}
                    {state.loadingMore && <LoadingState message="Loading more posts..." />}
                    {!state.loadingMore && // No more posts
                        !state.loading && // Not loading
                        !state.metadata.hasMore && // No more posts to load
                        !(state.posts.length === 0) && // No posts found
                        <NoMorePosts />
                    }
                    {state.posts.length === 0 &&
                        !state.loading &&
                        <EmptyState />
                    }
                </div>
            </div>
        </TooltipProvider>
    );
};

export default HomePageBlogCollection;