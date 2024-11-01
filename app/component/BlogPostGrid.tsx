import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Eye, ImageIcon, ThumbsUp, User } from 'lucide-react';
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

const getCategoryColor = (category: string): { bg: string; text: string; border: string } => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
        DSA: {
            bg: 'bg-blue-100 dark:bg-blue-900',
            text: 'text-blue-800 dark:text-blue-200',
            border: 'border-blue-200 dark:border-blue-800'
        },
        WebDev: {
            bg: 'bg-purple-100 dark:bg-purple-900',
            text: 'text-purple-800 dark:text-purple-200',
            border: 'border-purple-200 dark:border-purple-800'
        },
        "Job Posting": {
            bg: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-800 dark:text-green-200',
            border: 'border-green-200 dark:border-green-800'
        },
        AI: {
            bg: 'bg-orange-100 dark:bg-orange-900',
            text: 'text-orange-800 dark:text-orange-200',
            border: 'border-orange-200 dark:border-orange-800'
        },
        ML: {
            bg: 'bg-red-100 dark:bg-red-900',
            text: 'text-red-800 dark:text-red-200',
            border: 'border-red-200 dark:border-red-800'
        },
        "Skill Development": {
            bg: 'bg-yellow-100 dark:bg-yellow-900',
            text: 'text-yellow-800 dark:text-yellow-200',
            border: 'border-yellow-200 dark:border-yellow-800'
        },
        "Resume and Cover Letter Guidance": {
            bg: 'bg-indigo-100 dark:bg-indigo-900',
            text: 'text-indigo-800 dark:text-indigo-200',
            border: 'border-indigo-200 dark:border-indigo-800'
        },
        "Interview Preparation": {
            bg: 'bg-pink-100 dark:bg-pink-900',
            text: 'text-pink-800 dark:text-pink-200',
            border: 'border-pink-200 dark:border-pink-800'
        },
        "Tech-news": {
            bg: 'bg-cyan-100 dark:bg-cyan-900',
            text: 'text-cyan-800 dark:text-cyan-200',
            border: 'border-cyan-200 dark:border-cyan-800'
        },
        Internship: {
            bg: 'bg-teal-100 dark:bg-teal-900',
            text: 'text-teal-800 dark:text-teal-200',
            border: 'border-teal-200 dark:border-teal-800'
        },
        Others: {
            bg: 'bg-gray-100 dark:bg-gray-800',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-gray-200 dark:border-gray-700'
        }
    };
    return colors[category] || {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        border: 'border-gray-200 dark:border-gray-700'
    };
};

const BlogPostGrid = ({ loading, filteredPosts, users }: { loading: boolean; filteredPosts: BlogPostType[]; users: { [key: string]: UserType } }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading
                    ? Array(6)
                        .fill(null)
                        .map((_, index) => <SkeletonCard key={index} />)
                    : filteredPosts.map((post) => (
                        <BlogPostCard key={post._id} post={post} user={users[post.createdBy]} />
                    ))}
            </div>
            {filteredPosts.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center space-y-4 mt-16">
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        No posts found
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Try adjusting your search criteria
                    </p>
                </div>
            )}
        </div>
    );
};

const SkeletonCard = () => (
    <Card className="overflow-hidden animate-pulse">
        <Skeleton className="h-48 w-full md:h-56 lg:h-64" />
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

const BlogPostCard = ({ post, user }: { post: BlogPostType; user: UserType }) => {
    const categoryColors = getCategoryColor(post.category);

    return (
        <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105`}>
                        {post.category}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <CardTitle className="text-white text-xl md:text-2xl font-bold line-clamp-2 mb-2">
                        {post.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-200">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <CardContent className="flex-grow pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags &&
                        post.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2.5 py-0.5 rounded-full transition-transform duration-200 hover:scale-105"
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
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${post.title}\nRead here: ${window.location.origin}/blogs/${post._id}\n\n`);
                                toast.success('Copied to clipboard!');
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                        >
                            <FaClipboard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
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
                            className="w-full group hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 transition-all duration-200"
                        >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </CardFooter>
            </div>
        </Card>
    );
};

export default BlogPostGrid;