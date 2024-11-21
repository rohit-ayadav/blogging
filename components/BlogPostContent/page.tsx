"use client";

import React, { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Author, BlogPostType } from '@/types/blogs-types';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import BlogPostHeader from '../BlogPostHeader/page';
import BlogPostContent from '../BlogPostContent011/page';
import BlogPostFooter from '../BlogPostFooter/page';

const CommentSection = dynamic(
    () => import('@/app/component/commentsection'),
    {
        loading: () => <SectionSkeleton />,
        ssr: false
    }
);

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
    <div className="text-center py-8 space-y-4">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
            {error.message}
        </p>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                transition-colors duration-200"
        >
            Try again
        </button>
    </div>
);

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
    const postStats = useMemo(() => ({
        likes: initialData.likes || 0,
        views: initialData.views || 0
    }), [initialData.likes, initialData.views]);

    const handleError = (error: Error) => {
        console.error('Blog post error:', error);
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={handleError}
                onReset={() => window.location.reload()}
            >
                <BlogPostHeader post={initialData} author={author} />
                <BlogPostContainer>
                    <article className="prose dark:prose-invert max-w-none">
                        <BlogPostContent post={initialData} />

                        <BlogPostFooter
                            post={initialData}
                            likes={postStats.likes}
                            views={postStats.views}
                            id={id}
                        />
                    </article>

                    <section
                        className="mt-8 border-t dark:border-gray-800 pt-8"
                        aria-label="Comments"
                    >
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

export default React.memo(BlogPostClientContent, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.initialData.likes === nextProps.initialData.likes &&
        prevProps.initialData.views === nextProps.initialData.views
    );
});