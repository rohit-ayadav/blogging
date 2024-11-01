"use client";

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import useBlogPost from '../../hooks/useBlogPost';
import BlogPostHeader from '../BlogPostHeader/page';
import BlogPostContent from '../BlogPostContent011/page';
import BlogPostFooter from '../BlogPostFooter/page';
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/component/newsletter';
import CommentSection from '@/app/component/commentsection';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/context/ThemeContext';
interface BlogPostClientContentProps {
    initialData: any;
    id: string;
}

const BlogPostClientContent: React.FC<BlogPostClientContentProps> = ({ initialData, id }) => {
    const { post, author, relatedPosts, authorPosts, likes, views, liked, isLoading, error } = useBlogPost(id, initialData);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    // useEffect(() => {
    //     if (typeof window !== 'undefined' && navigator.clipboard && post?.content) {
    //         navigator.clipboard.writeText(post.content);
    //         toast.success('Content copied to clipboard');
    //     }
    // }, [post]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400">
                Error: {error.message}
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!post || !author) {
        return <LoadingSkeleton />;
    }
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <BlogPostHeader post={post} author={author} />
            <main className="container mx-auto px-4">
                <BlogPostContent post={post} />
                <BlogPostFooter post={post} likes={likes} views={views} liked={liked} id={id} />
                <CommentSection postId={id} />
                <RelatedPosts posts={relatedPosts} />
                <NewsLetter />
                <AuthorPosts author={author} posts={authorPosts} />
            </main>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />

        </div>
    </div>
);

export default BlogPostClientContent;