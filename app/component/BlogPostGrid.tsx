import React, { useEffect, useRef, useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { BlogPostCard, SkeletonCard } from './BlogPostCard';

interface BlogPostType {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    thumbnail?: string;
    views?: number;
    likes?: number;
    bio?: string;
    category: string;
}

interface UserType {
    email: string;
    name: string;
    image: string;
    bio: string;
    follower: number;
    following: number;
    noOfBlogs: number;
    createdAt: string;
    updatedAt: string;
    theme: string;
}

interface BlogPostGridProps {
    loading: boolean;
    filteredPosts: BlogPostType[];
    users: { [key: string]: UserType };
    hasMore: boolean;
    onLoadMore: () => Promise<void>;
}

const BlogPostGrid = ({ loading, filteredPosts, users, hasMore, onLoadMore }: BlogPostGridProps) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMore && !loading && !isLoadingMore) {
                    setIsLoadingMore(true);
                    await onLoadMore();
                    setIsLoadingMore(false);
                }
            },
            {
                root: null,
                rootMargin: '100px',
                threshold: 0.1,
            }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, isLoadingMore, onLoadMore]);

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

            {filteredPosts.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center space-y-4 mt-16">
                    <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 animate-pulse" />
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold">
                        No posts found
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Try adjusting your search criteria
                    </p>
                </div>
            )}

            {(hasMore || isLoadingMore) && filteredPosts.length > 0 && (
                <div
                    ref={observerTarget}
                    className="flex justify-center items-center mt-8 pb-8"
                >
                    {isLoadingMore && (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Loading more posts...
                            </span>
                        </div>
                    )}
                </div>
            )}
            {!hasMore && filteredPosts.length > 0 && (
                <div className="flex justify-center items-center mt-8 pb-8">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        No more posts to load.
                        <a href='/create' className="text-blue-500 dark:text-blue-400 font-semibold hover:underline"> Write </a> your blog to see
                    </span>
                </div>
            )}
        </div>
    );
};

export default BlogPostGrid;