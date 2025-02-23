import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ThumbsUp, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { BlogPostType, UserType } from '@/types/blogs-types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PostCardProps {
    post: BlogPostType;
    showStats?: boolean;
    author?: UserType;
}

export const PostCard = ({ post, showStats = false, author }: PostCardProps) => {
    const router = useRouter();
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const deletePost = async (id: string) => {
        try {
            window.confirm('Are you sure you want to delete this post?') && await fetch(`/api/blogs/${id}`, {
                method: 'DELETE',
            });
            toast.success('Post deleted successfully');
            router.refresh()
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error(error);
        }
    };

    return (
        <Card className="h-full overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group">
            <Link href={`/blogs/${post._id}`} className="flex-1 flex flex-col">
                <div
                    className="h-48 w-full bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300"
                    style={{
                        backgroundImage: post.thumbnail ? `url(${post.thumbnail})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <CardContent className="flex-1 flex flex-col p-5">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                            {post.category}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.createdAt)}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                        {post.content.replace(/<[^>]+>/g, '').slice(0, 120) + (post.content.length > 120 ? '...' : '')}
                    </p>

                    {showStats && (
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-medium">{post.views?.toLocaleString() || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <ThumbsUp className="h-4 w-4" />
                                <span className="text-sm font-medium">{post.likes?.toLocaleString() || 0} likes</span>
                            </div>
                        </div>
                    )}
                    {/* // edit and delete */}
                    <div className="flex items-center gap-2 mt-4">
                        <Link href={`/edit/${post.slug}`}>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                Edit
                            </button>
                        </Link>
                        <button className="text-sm text-red-600 dark:text-red-400 hover:underline"
                            onClick={() => deletePost(post._id)}
                        >Delete</button>
                        <Link href={`/stats/${post.slug}`}>
                            <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                Stats
                            </button>
                        </Link>
                    </div>

                </CardContent>
            </Link>
            {author && (
                <CardFooter className="px-5 py-3 border-t">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={author.image} alt={author.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-900 text-xs">
                                {author.name?.charAt(0).toUpperCase() || 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{author.name || 'Anonymous'}</span>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};