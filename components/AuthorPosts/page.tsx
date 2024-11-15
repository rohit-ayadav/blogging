import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostType, Author } from '@/types/blogs-types';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

interface AuthorPostsProps {
    author: Author;
    posts: BlogPostType[];
}

const AuthorPosts = ({ author, posts }: AuthorPostsProps) => {
    if (posts.length === 0) {
        return (
            <Card className="mb-8 mt-6 text-center p-8">
                <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-12 w-12" />
                    <p className="text-lg">No posts found from this author yet</p>
                </div>
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const stripHtml = (html: string) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    };

    return (
        <Card className="mb-8 mt-6 overflow-hidden border-0 shadow-md dark:bg-gray-800/50">
            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    More from {author?.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.slice(0, 3).map((post) => (
                        <Link
                            href={`/blogs/${post._id}`}
                            key={post._id}
                            className="group block"
                        >
                            <article className="h-full flex flex-col border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                                {post.thumbnail && (
                                    <div className="relative w-full pt-[56.25%] overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={post.thumbnail}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col flex-grow p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <Calendar className="h-4 w-4" />
                                        <time dateTime={post.createdAt}>
                                            {formatDate(post.createdAt)}
                                        </time>
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                                        {stripHtml(post.content)}
                                    </p>

                                    <div className="mt-auto flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                                        Read more
                                        <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AuthorPosts;