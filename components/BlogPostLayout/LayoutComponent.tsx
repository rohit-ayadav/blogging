import React, { ReactNode, Suspense, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/_component/newsletter';
import TableOfContents from '../AuthorPosts/TableOfContents';
import { cn } from '@/lib/utils';
import { BlogPostType, Author } from '@/types/blogs-types';
import { Home, ChevronRight, ArrowLeft, Share2, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { BreadcrumbTrail } from './BreadcrumbTrail';

const SKELETON_COUNT = 3;

const NavigationButton = ({ onClick, label, icon: Icon }: { onClick: () => void; label: string; icon: React.ElementType }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "flex-shrink-0",
                        "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                        "transition-colors duration-300"
                    )}
                    aria-label={label}
                >
                    <Icon className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const Sidebar: React.FC<{
    post: BlogPostType;
    author: Author;
    authorPosts: BlogPostType[];
    error: Error | null;
    loading: boolean;
    relatedPosts: BlogPostType[]
}> = ({ post, author, authorPosts, error, loading, relatedPosts }) => {
    const { isDarkMode } = useTheme();

    return (
        <aside
            className={cn(
                "lg:col-span-4",
                isDarkMode ? "text-gray-200" : "text-gray-800"
            )}
        >
            <div className="sticky top-16 space-y-8">
                <SidebarSection>
                    <TableOfContents
                        content={post.content}
                        contentType={post.language as 'html' | 'markdown'}
                    />
                </SidebarSection>
                <SidebarSection>
                    <AuthorPosts author={author} posts={authorPosts} isDarkMode={isDarkMode} error={error} loading={loading} />
                </SidebarSection>
                <SidebarSection>
                    <RelatedPosts posts={relatedPosts} isDarkMode={isDarkMode} error={error} loading={loading} />
                </SidebarSection>
                <Suspense fallback={<SectionSkeleton />}>
                    <SidebarSection>
                        <NewsLetter />
                    </SidebarSection>
                </Suspense>
            </div>
        </aside>
    );
};

const SidebarSection: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isDarkMode } = useTheme();

    return (
        <div
            className={cn(
                "rounded-lg p-4",
                isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gray-50 text-gray-800"
            )}
        >
            {children}
        </div>
    );
};



const Header: React.FC<{
    post: BlogPostType;
    isLoading?: boolean;
    onShare: () => Promise<void>;
}> = ({ post, isLoading, onShare }) => {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode } = useTheme();

    // useEffect(() => {
    //     document.body.style.paddingTop = 'calc(4rem + 1px)';
    //     return () => {
    //         document.body.style.paddingTop = '';
    //     };
    // }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50",
                "transition-colors duration-300",
                isDarkMode
                    ? "bg-gray-900/80 text-gray-100"
                    : "bg-white/80 text-gray-900",
                "backdrop-blur-sm shadow-sm"
            )}
        >
            <div className="container mx-auto px-4 lg:px-8 py-3 md:py-4">
                <nav className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        <NavigationButton
                            onClick={() => router.back()}
                            label="Go back"
                            icon={ArrowLeft}
                        />
                        <BreadcrumbTrail post={post} isLoading={isLoading} isDarkMode={isDarkMode} />
                    </div>
                    <div className="flex items-center gap-2">
                        <NavigationButton
                            onClick={onShare}
                            label="Share this post"
                            icon={Share2}
                        />
                        <button
                            onClick={toggleDarkMode}
                            className={cn(
                                "p-2 rounded-md",
                                "transition-colors duration-200",
                                "hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            aria-label={
                                isDarkMode
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-indigo-600" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export { Sidebar, Header };

const SectionSkeleton = () => (
    <div className="space-y-4 px-4 animate-pulse">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
            {Array(SKELETON_COUNT).fill(null).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    </div>
);
