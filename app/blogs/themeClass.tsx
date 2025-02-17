import React from 'react';
import { Loader2, MoveUp, ScrollText, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeClasses } from '@/types/blogs-types';

interface LoadingStateProps {
    message?: string;
    className?: string;
}
export const themeClasses: (isDarkMode: boolean) => ThemeClasses = (isDarkMode: boolean) => {
    const themeClasses: ThemeClasses = {
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
    return themeClasses;
};
export const LoadingState = ({
    message = "Loading more posts...",
    className = ""
}: LoadingStateProps) => {
    const { isDarkMode } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                "flex flex-col items-center justify-center py-12 md:py-16 px-4",
                "bg-gradient-to-b from-transparent via-background/50 to-transparent",
                isDarkMode ? "text-gray-300" : "text-gray-600",
                className
            )}
        >
            <div className="relative mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className={cn(
                    "absolute inset-0 -z-10 animate-pulse blur-xl opacity-50",
                    isDarkMode ? "bg-primary/20" : "bg-primary/10"
                )} />
            </div>
            <span className="text-base font-medium">
                {message}
            </span>
        </motion.div>
    );
};

interface NoMorePostsProps {
    className?: string;
    onBackToTop?: () => void;
}

export const NoMorePosts = ({
    className = "",
    onBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
}: NoMorePostsProps) => {
    const { isDarkMode } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center py-16 px-4 space-y-6",
                "bg-gradient-to-b from-transparent via-background/50 to-transparent",
                className
            )}
        >
            <div className="relative">
                <ScrollText className={cn(
                    "h-12 w-12",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                )} />
                <div className={cn(
                    "absolute inset-0 -z-10 animate-pulse blur-lg",
                    isDarkMode ? "bg-primary/20" : "bg-primary/10"
                )} />
            </div>
            <div className={cn(
                "flex flex-col items-center space-y-2",
                isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
                <h3 className="text-xl font-semibold">You've reached the end</h3>
                <p className="text-sm text-center">No more posts to load</p>
            </div>
            <span
                onClick={onBackToTop}
                className={cn(
                    "group transition-all duration-300",
                    "hover:shadow-lg hover:scale-105",
                    isDarkMode ? "hover:bg-primary/20" : "hover:bg-primary/10",
                    "flex items-center space-x-2 px-6",
                    "rounded-full border border-transparent",
                    "text-primary",
                    "cursor-pointer select-none"
                )}
            >
                <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                <span>Back to top</span>
            </span>
        </motion.div>
    );
};

interface EmptyStateProps {
    title?: string;
    message?: string;
    className?: string;
    showIcon?: boolean;
}

export const EmptyState = ({
    title = "No posts found",
    message = "Try adjusting your search or filters to find what you're looking for",
    className = "",
    showIcon = true
}: EmptyStateProps) => {
    const { isDarkMode } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "flex flex-col items-center justify-center py-20 md:py-28 px-4",
                "space-y-8 text-center",
                "bg-gradient-to-b from-transparent via-background/50 to-transparent",
                className
            )}
        >
            {showIcon && (
                <div className="relative">
                    <ScrollText className={cn(
                        "h-16 w-16",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                    )} />
                    <div className={cn(
                        "absolute inset-0 -z-10 animate-pulse blur-xl",
                        isDarkMode ? "bg-primary/20" : "bg-primary/10"
                    )} />
                </div>
            )}
            <div className="space-y-4 max-w-lg">
                <h3 className={cn(
                    "text-2xl md:text-3xl font-bold tracking-tight",
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                )}>
                    {title}
                </h3>
                <p className={cn(
                    "text-base md:text-lg leading-relaxed",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                    {message}
                </p>
            </div>
        </motion.div>
    );
};