import React from 'react';
import { BlogPostCard, SkeletonCard } from './BlogPostCard';
import { BlogPostType, UserType } from '@/types/blogs-types';
interface BlogPostGridProps {
    loading: boolean;
    filteredPosts: BlogPostType[];
    users: { [key: string]: UserType };
}

const BlogPostGrid = ({ loading, filteredPosts, users }: BlogPostGridProps) => {

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading && filteredPosts.length === 0
                    ? Array(6)
                        .fill(null)
                        .map((_, index) => <SkeletonCard key={index} />)
                    : filteredPosts.map((post) => (
                        <BlogPostCard key={post._id} post={post} user={users[post.createdBy]} />
                    ))}
            </div>
        </div>
    );
};

export default BlogPostGrid;