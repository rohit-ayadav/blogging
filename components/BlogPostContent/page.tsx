"use client";
import React, { Suspense } from 'react';
import BlogPostHeader from '../BlogPostHeader/page';
import BlogPostContent from '../BlogPostContent011/page';
import BlogPostFooter from '../BlogPostFooter/page';
import CommentSection from '@/app/component/commentsection';
import { Skeleton } from '@/components/ui/skeleton';
import { Author, BlogPostType } from '@/types/blogs-types';
interface BlogPostClientContentProps {
    initialData: BlogPostType;
    id: string;
    author: Author;
}

const BlogPostClientContent: React.FC<BlogPostClientContentProps> = ({ initialData, id, author }) => {

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <BlogPostHeader post={initialData} author={author} />

            <div className="container mx-auto px-4">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-12">
                        <article>
                            <BlogPostContent post={initialData} />
                            <BlogPostFooter
                                post={initialData}
                                likes={initialData.likes || 0}
                                views={initialData.views || 0}
                                id={id}
                            />
                        </article>
                        <div className="mt-8">
                            <Suspense fallback={<SectionSkeleton />}>
                                <CommentSection postId={id} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionSkeleton = () => (
    <div className="space-y-4 px-4">
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