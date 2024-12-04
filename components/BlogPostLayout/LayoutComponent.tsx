import React, { ReactNode, Suspense } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/component/newsletter';
import TableOfContents from '../AuthorPosts/TableOfContents';
import { cn } from '@/lib/utils';
import { BlogPostType, Author } from '@/types/blogs-types';
import { Home, ChevronRight, ArrowLeft, Share2, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SKELETON_COUNT = 3;

const Breadcrumb = ({ href, children }: { href: string; children: ReactNode }) => (
    <Link
        href={href}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 
               dark:hover:text-white transition-colors"
    >
        {children}
    </Link>
);

const NavigationButton = ({
    onClick,
    label,
    icon: Icon
}: {
    onClick: () => void;
    label: string;
    icon: React.ElementType
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    aria-label={label}
                >
                    <Icon className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
const SectionSkeleton = () => (
    <div className="space-y-4 px-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
            {Array(SKELETON_COUNT).fill(null).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full" />
                </div>
            ))}
        </div>
    </div>
);


const Sidebar: React.FC<{ post: BlogPostType; author: Author; authorPosts: BlogPostType[]; relatedPosts: BlogPostType[] }> =
    ({ post, author, authorPosts, relatedPosts }) => (
        <aside className="lg:col-span-4">
            <div className="sticky top-16 space-y-8">
                <SidebarSection>
                    <TableOfContents
                        content={post.content}
                        contentType={post.language as 'html' | 'markdown'}
                    />
                </SidebarSection>
                <SidebarSection>
                    <AuthorPosts author={author} posts={authorPosts} />
                </SidebarSection>
                <SidebarSection>
                    <RelatedPosts posts={relatedPosts} />
                </SidebarSection>
                <Suspense fallback={<SectionSkeleton />}>
                    <SidebarSection>
                        <NewsLetter />
                    </SidebarSection>
                </Suspense>
            </div>
        </aside>
    );

const SidebarSection: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        {children}
    </div>
);

const BreadcrumbTrail: React.FC<{ post: BlogPostType; isLoading?: boolean }> = ({ post, isLoading }) => (
    <div className="flex items-center gap-1 md:gap-2 text-sm overflow-x-auto hide-scrollbar">
        <Breadcrumb href="/">
            <Home className="h-4 w-4 md:mr-1 flex-shrink-0" />
            <span className="hidden md:inline">Home</span>
        </Breadcrumb>
        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
        <Breadcrumb href="/blogs">Blog</Breadcrumb>
        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
        <div className="relative flex-1 min-w-0">
            {isLoading ? (
                <Skeleton className="h-6 w-32" />
            ) : (
                <span
                    className="text-gray-900 dark:text-white font-medium block truncate 
                       md:overflow-visible md:whitespace-normal"
                    title={post?.title}
                >
                    {post?.title}
                </span>
            )}
        </div>
    </div>
);

const Header: React.FC<{
    post: BlogPostType;
    isLoading?: boolean;
    onShare: () => Promise<void>;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}> = ({ post, isLoading, onShare, isDarkMode, onToggleTheme }) => {
    const router = useRouter();

    return (
        <header className={cn(
            "sticky top-0 z-50 transition-colors duration-300",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
        )}>
            <div className="container mx-auto px-4 lg:px-8 py-3 md:py-4">
                <nav className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        <NavigationButton
                            onClick={() => router.back()}
                            label="Go back"
                            icon={ArrowLeft}
                        />
                        <BreadcrumbTrail post={post} isLoading={isLoading} />
                    </div>
                    <div className="flex items-center gap-2">
                        <NavigationButton
                            onClick={onShare}
                            label="Share this post"
                            icon={Share2}
                        />
                        {/* <NavigationButton
                onClick={onToggleTheme}
                label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                icon={isDarkMode ? Sun : Moon}
              /> */}
                        <button
                            onClick={onToggleTheme}
                            className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export { Sidebar, Header }; 
