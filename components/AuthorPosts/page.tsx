import React from 'react';
import Link from 'next/link';
import { BlogPostType, Author } from '@/types/blogs-types';
import { Calendar, ArrowRight, User, TimerIcon, Clock } from 'lucide-react';
import LoadingSkeleton from '../LoadingComponent';
import { formatRelativeTime, getReadingTime } from '@/utils/date-formatter';

interface AuthorPostsProps {
    author: Author | null;
    posts: BlogPostType[];
    isDarkMode: boolean;
    error: Error | null;
    loading: boolean;
}

const AuthorPosts = ({ author, posts, isDarkMode, error, loading }: AuthorPostsProps) => {
    if (error) {
        return <p className="text-red-500">Error fetching author posts</p>;
    }
    if (loading) {
        return <LoadingSkeleton />;
    }
   
    return (
        <div className={`space-y-4 ${isDarkMode ? 'dark' : ''}`}>
            {/* Author Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                    {author?.image ? (
                        <img
                            src={author.image}
                            alt={author.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                ${isDarkMode
                                    ? 'bg-gray-700'
                                    : 'bg-gray-200'
                                }
                            `}
                        >
                            <User
                                className={`w-6 h-6 
                                    ${isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                    }
                                `}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <h3
                        className={`
                            font-semibold 
                            ${isDarkMode
                                ? 'text-white'
                                : 'text-gray-900'
                            }
                        `}
                    >
                        {author?.name}
                    </h3>
                    <p
                        className={`
                            text-sm 
                            ${isDarkMode
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }
                        `}
                    >
                        More posts from this author
                    </p>
                </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {!loading && posts.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">
                        No more posts from this author
                    </p>
                )}
                {posts.slice(0, 5).map((post) => (
                    <Link
                        href={`/blogs/${post.slug}`}
                        key={post._id}
                        className="group block"
                    >
                        <article
                            className={`
                                flex gap-4 p-3 rounded-lg transition-colors
                                ${isDarkMode
                                    ? 'hover:bg-gray-700/50'
                                    : 'hover:bg-gray-100'
                                }
                            `}
                        >
                            {post.thumbnail && (
                                <div className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h4
                                    className={`
                                        font-medium text-sm mb-1 line-clamp-2
                                        ${isDarkMode
                                            ? 'text-white hover:text-blue-400'
                                            : 'text-gray-900 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    {post.title}
                                </h4>

                                <div
                                    className={`
                                        flex items-center gap-2 text-xs
                                        ${isDarkMode
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        <time dateTime={post.createdAt}>
                                            {formatRelativeTime(post.createdAt)}
                                        </time>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Clock className="h-3 w-3" />
                                        <span>{getReadingTime(post.content)}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            <Link
                href={`/author/${author?.username}`}
                className={`
                    inline-flex items-center text-sm transition-colors mt-2
                    ${isDarkMode
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-800'
                    }
                `}
            >
                View all posts
                <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
        </div >
    );
};

export default AuthorPosts;