import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, RefreshCcw, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, stateType } from '@/types/blogs-types';
import { BlogPostType } from '@/types/blogs-types';
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
    const { isDarkMode } = useTheme();

    if (state.error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh] px-4">
                <p className="text-xl font-bold text-red-500 mb-4">Failed to load data</p>
                <Button
                    onClick={handleRetry}
                    className="flex items-center gap-2"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className={`${themeClasses(isDarkMode).layout} transition-colors duration-200 px-4 sm:px-6 lg:px-8`}>
                <Toaster />

                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Search and Filter Controls */}
                    <div className="pt-4 pb-2">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between max-w-3xl mx-auto">
                            <div className="relative w-full sm:w-80">
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
                                    className="pl-10 pr-8"
                                    aria-label="Search blog posts"
                                />
                                {state.searchTerm && (
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        onClick={() => setState(prev => ({ ...prev, searchTerm: '', page: 1 }))}
                                    >
                                        {searchLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={state.category}
                                    onValueChange={(value) => setState(prev => ({
                                        ...prev,
                                        category: value,
                                        page: 1
                                    }))}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="trending">Trending</SelectItem>
                                        <SelectItem value="oldest">Oldest</SelectItem>
                                        <SelectItem value="mostViews">Most Views</SelectItem>
                                        <SelectItem value="mostLikes">Most Likes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    {!(state.posts.length === 0 && !state.loading) && !state.loadingMore && (
                        <div className="mb-6 hidden sm:block">
                            <DashboardGrid
                                totalBlogs={state.stats.totalBlogs}
                                totalViews={state.stats.totalViews}
                                totalLikes={state.stats.totalLikes}
                                totalUsers={state.stats.totalUsers}
                                loading={state.statsLoading}
                            />
                        </div>
                    )}

                    {/* Posts Grid */}
                    <div>
                        <BlogPostGrid
                            filteredPosts={
                                Array.from(new Set(state.posts.map(post => post._id)))
                                    .map(id => state.posts.find(post => post._id === id))
                                    .filter((post): post is BlogPostType => post !== undefined)
                            }
                            users={state.users}
                            loading={state.loading}
                        />
                    </div>

                    {/* States */}
                    {state.loadingMore && <LoadingState message="Loading more posts..." />}
                    {!state.loadingMore && !state.loading && !state.metadata.hasMore && state.posts.length > 0 && (
                        <NoMorePosts />
                    )}
                    {state.posts.length === 0 && !state.loading && <EmptyState />}
                </div>
            </div>
        </TooltipProvider>
    );
};

export default HomePageBlogCollection;