import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, RefreshCcw, Loader2, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, stateType } from '@/types/blogs-types';
import { BlogPostType } from '@/types/blogs-types';
import { Toaster } from '@/components/ui/toaster';
import DashboardGrid from '@/app/_component/dashboard/dashboardGrid';
import BlogPostGrid from '@/app/_component/BlogPostGrid';
import { Button } from '@/components/ui/button';
import { EmptyState, LoadingState, NoMorePosts, themeClasses } from '../themeClass';
import { useTheme } from '@/context/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HomePageBlogCollectionProps {
    state: stateType;
    handleRetry: () => void;
    setState: React.Dispatch<React.SetStateAction<stateType>>;
    searchLoading: boolean;
}

const HomePageBlogCollection = ({ state, handleRetry, setState, searchLoading }: HomePageBlogCollectionProps) => {
    const { isDarkMode } = useTheme();
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    // Debounce search input to reduce API calls
    const [searchInput, setSearchInput] = React.useState(state.searchTerm);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setState(prev => ({
                ...prev,
                searchTerm: searchInput,
                page: 1
            }));
        }, 300); // Debounce for 300ms

        return () => clearTimeout(timer);
    }, [searchInput, setState]);

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
                    <div className="pt-4 pb-2 sticky top-0 z-10 bg-inherit backdrop-blur-sm">
                        <div className="flex items-center gap-2 max-w-3xl mx-auto">
                            {/* Search Input - Takes most space */}
                            <div className="relative flex-grow">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                    aria-hidden="true"
                                />
                                <Input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10 pr-8 w-full"
                                    aria-label="Search blog posts"
                                />
                                {searchInput && (
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        onClick={() => {
                                            setSearchInput('');
                                            setState(prev => ({ ...prev, searchTerm: '', page: 1 }));
                                        }}
                                        aria-label="Clear search"
                                    >
                                        {searchLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Mobile Filter Button */}
                            <div className="md:hidden">
                                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Filter className="h-4 w-4" />
                                            <span className="sr-only sm:not-sr-only">Filters</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[280px] py-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Category</h3>
                                                <Select
                                                    value={state.category}
                                                    onValueChange={(value) => {
                                                        setState(prev => ({
                                                            ...prev,
                                                            category: value,
                                                            page: 1
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
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
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Sort By</h3>
                                                <Select
                                                    value={state.sortBy}
                                                    onValueChange={(value) => {
                                                        setState(prev => ({
                                                            ...prev,
                                                            sortBy: value,
                                                            page: 1
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
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
                                            <Button
                                                onClick={() => setIsFilterOpen(false)}
                                                className="w-full mt-4"
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Desktop Filters - Hidden on Mobile */}
                            <div className="hidden md:flex md:items-center md:gap-2">
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

                    {/* Active Filters Display */}
                    {(state.category !== 'all' || state.sortBy !== 'newest' || state.searchTerm) && (
                        <div className="flex flex-wrap gap-2 max-w-3xl mx-auto">
                            {state.category !== 'all' && (
                                <div className="inline-flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                    <span>Category: {CATEGORIES.find(c => c.value === state.category)?.label}</span>
                                    <button
                                        onClick={() => setState(prev => ({ ...prev, category: 'all', page: 1 }))}
                                        aria-label="Remove category filter"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {state.sortBy !== 'newest' && (
                                <div className="inline-flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                    <span>Sort: {state.sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                    <button
                                        onClick={() => setState(prev => ({ ...prev, sortBy: 'newest', page: 1 }))}
                                        aria-label="Remove sort filter"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {state.searchTerm && (
                                <div className="inline-flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                    <span>Search: {state.searchTerm}</span>
                                    <button
                                        onClick={() => {
                                            setSearchInput('');
                                            setState(prev => ({ ...prev, searchTerm: '', page: 1 }));
                                        }}
                                        aria-label="Remove search filter"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {(state.category !== 'all' || state.sortBy !== 'newest' || state.searchTerm) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                        setSearchInput('');
                                        setState(prev => ({
                                            ...prev,
                                            category: 'all',
                                            sortBy: 'newest',
                                            searchTerm: '',
                                            page: 1
                                        }));
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Stats Section */}
                    {!(state.posts.length === 0 && !state.loading) && !state.loadingMore && (
                        <div className="mb-6">
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
                    {state.posts.length === 0 && !state.loading && (
                        // <EmptyState searchTerm={state.searchTerm} hasFilters={state.category !== 'all'} />
                        <EmptyState title='No posts found' message='Try changing your search query or filters.' />
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
};

export default HomePageBlogCollection;