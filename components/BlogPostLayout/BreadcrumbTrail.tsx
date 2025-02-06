import React, { ReactNode } from 'react';
import { Home, ChevronRight, Text } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPostType } from '@/types/blogs-types';
import Link from 'next/link';
import cn from 'classnames';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getBreadcrumbClasses = (isDarkMode: boolean) => ({
    container: cn(
        'flex items-center gap-1 md:gap-2 text-sm overflow-x-auto hide-scrollbar',
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
    ),
    homeIcon: cn(
        'h-4 w-4 md:mr-1 flex-shrink-0',
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
    ),
    separator: cn(
        'h-4 w-4 flex-shrink-0',
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
    ),
    skeleton: cn(
        'h-6 w-32',
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
    ),
    title: cn(
        'font-medium block truncate md:overflow-visible md:whitespace-normal',
        isDarkMode ? 'text-white bg-opacity-70' : 'text-gray-900'
    )
});

const Breadcrumb = ({ href, isDarkMode, text, children }: { href: string; isDarkMode: boolean; text: string; children: ReactNode }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={href}
                    className={cn(
                        "flex items-center",
                        isDarkMode ? "text-gray-300" : "text-gray-600",
                        isDarkMode ? "hover:text-gray-300" : "hover:text-gray-900",
                        "transition-colors duration-300"
                    )}
                >
                    {children}
                </Link>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export const BreadcrumbTrail: React.FC<{
    post: BlogPostType;
    isLoading?: boolean;
    isDarkMode: boolean;
}> = ({ post, isLoading, isDarkMode }) => {
    const classes = getBreadcrumbClasses(isDarkMode);

    return (
        <div className={classes.container}>
            <Breadcrumb href="/" isDarkMode={isDarkMode} text='Go to Home'>
                <Home className={classes.homeIcon} />
                <span className="hidden md:inline">Home</span>
            </Breadcrumb>

            <ChevronRight
                className={classes.separator}
                aria-hidden="true"
            />

            <Breadcrumb href="/blogs" isDarkMode={isDarkMode} text='Go to Blogs'>
                <Text className={classes.homeIcon} />
                <span className="hidden md:inline">Blogs</span>
            </Breadcrumb>

            <ChevronRight
                className={classes.separator}
                aria-hidden="true"
            />

            <div className="relative flex-1 min-w-0">
                {isLoading ? (
                    <Skeleton className={classes.skeleton} />
                ) : (
                    <span
                        className={classes.title}
                        title={post?.title}
                    >
                        {post?.title}
                    </span>
                )}
            </div>
        </div>
    );
};