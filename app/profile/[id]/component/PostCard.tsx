import { Eye, ThumbsUp } from 'react-feather';
import Link from 'next/link';
import { BlogPostType } from '@/types/blogs-types';
import { formatDate, formatRelativeTime } from '@/utils/date-formatter';

export const PostCard = ({ post }: { post: BlogPostType }) => {
    const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

    return (
        <Link href={`/blogs/${post._id}`}>
            <div className="border p-4 rounded-lg hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group bg-white dark:bg-gray-800">
                {post.thumbnail && (
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-blue-600 dark:text-blue-400">{post.category}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{readingTime} min read</span>
                    </div>
                    <h3 className="font-semibold text-xl group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                    </h3>
                    <p className="line-clamp-3 text-gray-700 dark:text-gray-300 mb-4">
                        {post.content.replace(/<[^>]+>/g, '')}
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {post?.tags?.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {formatRelativeTime(post.createdAt)}
                        </time>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.likes?.toLocaleString() ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};