"use client";

import React, { Suspense, useEffect } from 'react';
import { Author, BlogPostType } from '@/types/blogs-types';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import BlogPostHeader from '../BlogPostHeader/page';
import BlogPostFooter from '../BlogPostFooter/page';
import { useTheme } from '@/context/ThemeContext';
import { CommentSection } from '@/app/_component/commentsection';
import RenderContent from '@/app/blogs/components/RenderContent';
import { incrementView } from '@/lib/viewIncrement';

const SKELETON_COUNT = 3;
interface BlogPostClientContentProps {
    initialData: BlogPostType;
    id: string;
    author: Author;
}
const ErrorFallback = ({ error, resetErrorBoundary }: {
    error: Error;
    resetErrorBoundary: () => void;
}) => (
    <div className={`text-center py-8 space-y-4 ${error ? 'bg-red-50 dark:bg-red-900' : ''}`}>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
            {error.message}
        </p>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-500 text-white rounded-md 
                hover:bg-blue-600 transition-colors duration-200
                dark:bg-blue-600 dark:hover:bg-blue-700"
        >
            Try again
        </button>
    </div>
);

const SectionSkeleton = () => (
    <div className="space-y-4 px-4 animate-pulse dark:bg-gray-800">
        <Skeleton className="h-6 w-32 dark:bg-gray-700" />
        <div className="space-y-3">
            {Array(SKELETON_COUNT).fill(null).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full dark:bg-gray-700" />
                    <Skeleton className="h-4 w-3/4 dark:bg-gray-700" />
                </div>
            ))}
        </div>
    </div>
);

const BlogPostContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-12">
                {children}
            </div>
        </div>
    </div>
);

const BlogPostClientContent: React.FC<BlogPostClientContentProps> = ({
    initialData,
    id,
    author
}) => {
    const postStats = {
        likes: initialData.likes || 0,
        views: initialData.views || 0
    };

    useEffect(() => {
        incrementView(id, false);
    }, [id]);

    const { isDarkMode } = useTheme();

    const handleError = (error: Error) => {
        console.error('Blog post error:', error);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100 prose-dark' : 'bg-white text-gray-900 prose-light'}`}>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={handleError}
                onReset={() => window.location.reload()}
            >
                <BlogPostHeader post={initialData} author={author} isDarkMode={isDarkMode} />
                <BlogPostContainer>
                    <article
                        className={`
                            prose max-w-none 
                            ${isDarkMode
                                ? 'prose-dark dark:prose-invert'
                                : 'prose-light'}
                        `}
                    >
                        <RenderContent {...initialData} />
                        <BlogPostFooter
                            post={initialData}
                            likes={postStats.likes}
                            views={postStats.views}
                            id={id}
                        />
                    </article>

                    <section className={`mt-8 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`} aria-label="Comments">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onError={handleError}
                            onReset={() => window.location.reload()}
                        >
                            <Suspense fallback={<SectionSkeleton />}>
                                <CommentSection postId={id} />
                            </Suspense>
                        </ErrorBoundary>
                    </section>
                </BlogPostContainer>
            </ErrorBoundary>
        </div>
    );
};

export default BlogPostClientContent;