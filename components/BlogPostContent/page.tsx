"use client";

import React, { Suspense } from 'react';
import useBlogPost from '../../hooks/useBlogPost';
import BlogPostHeader from '../BlogPostHeader/page';
import BlogPostContent from '../BlogPostContent011/page';
import BlogPostFooter from '../BlogPostFooter/page';
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/component/newsletter';
import CommentSection from '@/app/component/commentsection';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCcw } from 'lucide-react';
import { BlogPostType } from '@/types/blogs-types';

interface BlogPostClientContentProps {
    initialData: BlogPostType;
    id: string;
}

const BlogPostClientContent: React.FC<BlogPostClientContentProps> = ({ initialData, id }) => {
    const {
        post,
        author,
        relatedPosts,
        authorPosts,
        likes,
        views,
        liked,
        isLoading,
        error,
        language
    } = useBlogPost(id, initialData);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-2">
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                        {error.message || 'Failed to load blog post'}
                    </AlertDescription>
                </Alert>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!post || !author) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] px-2">
                <Alert>
                    <AlertDescription>
                        Blog post or author information not found.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <BlogPostHeader post={post} author={author} />
            <article className="mx-auto">
                <Suspense fallback={<LoadingSkeleton />}>
                    <BlogPostContent post={post} language={language} />
                </Suspense>
                <BlogPostFooter
                    post={post}
                    likes={likes}
                    views={views}
                    liked={liked}
                    id={id}
                />
            </article>

            <div className="mt-8 space-y-8">
                <Suspense fallback={<SectionSkeleton />}>
                    <CommentSection postId={id} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <RelatedPosts posts={relatedPosts} />
                </Suspense>

                <div className="px-2">
                    <NewsLetter />
                </div>

                <Suspense fallback={<SectionSkeleton />}>
                    <AuthorPosts author={author} posts={authorPosts} />
                </Suspense>
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="px-2">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <div className="space-y-3">
            {Array(6).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
    </div>
);

const SectionSkeleton = () => (
    <div className="space-y-4 px-2">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
            {Array(3).fill(null).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    </div>
);

export default BlogPostClientContent;