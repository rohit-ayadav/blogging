import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Copy, Eye, ImageIcon, ThumbsUp, User } from 'lucide-react';
import Link from 'next/link';
import { FaClipboard } from 'react-icons/fa';
import toast from 'react-hot-toast';

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



const BlogPostGrid = ({ loading, filteredPosts, users }: { loading: boolean; filteredPosts: BlogPostType[]; users: { [key: string]: UserType } }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array(6)
                        .fill(null)
                        .map((_, index) => <SkeletonCard key={index} />)
                    : filteredPosts.map((post) => (
                        <BlogPostCard key={post._id} post={post} user={users[post.createdBy]} />
                    ))}
            </div>
            {filteredPosts.length === 0 && !loading && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    No posts found. Try adjusting your search.
                </p>
            )}
        </div>
    );
};

const SkeletonCard = () => (
    <Card className="overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);

const BlogPostCard = ({ post, user }: { post: BlogPostType; user: UserType }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="relative h-48 sm:h-56 lg:h-64">
            {post.thumbnail ? (
                <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                    }}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
                <CardTitle className="text-white text-xl sm:text-2xl font-bold line-clamp-2 mb-2">
                    {post.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-200">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        <CardContent className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-4 mt-4">
                {post.tags &&
                    post.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
            </div>
            <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
                {post.content.replace(/<[^>]+>/g, '')}
            </p>
        </CardContent>
        <div className="mt-auto">
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Avatar>
                        {user?.image ? (
                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.name || 'Unknown User'}
                    </span>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                    <div className="flex items-center space-x-1">
                        <span onClick={() => {
                            navigator.clipboard.writeText(`${post.title}\nRead here: ${window.location.origin}/blogs/${post._id}`);
                            toast.success('Copied to clipboard!');
                        }}
                            className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300">
                            {/* \n${post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}\n */}
                            <FaClipboard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{post.views || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{post.likes || 0}</span>
                    </div>
                </div>
            </CardFooter>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Link href={`/blogs/${post._id}`} className="w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full group bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </CardFooter>
        </div >
    </Card >
);

export default BlogPostGrid;