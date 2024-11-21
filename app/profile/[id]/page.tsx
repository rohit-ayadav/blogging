"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Mail, Globe, ArrowLeft, Eye, ThumbsUp, Facebook, Twitter } from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NewsLetter from '../../component/newsletter';
import { BlogPostType } from '@/types/blogs-types';
import { useTheme } from '@/context/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from 'react-error-boundary';

interface Author {
    _id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    website?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
}

interface PostCardProps {
    post: BlogPostType;
}

// Separate Post Card component for better organization and reusability
const PostCard = ({ post }: PostCardProps) => (
    <Link href={`/blogs/${post._id}`}>
        <div className="border p-4 rounded-lg hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
            <div>
                <h3 className="font-semibold group-hover:text-blue-600 transition-colors">{post.title}</h3>
                <div className="flex items-center space-x-2 mt-2 mb-4 text-gray-600 dark:text-gray-400">
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes?.toLocaleString() ?? 0}</span>
                    </div>
                </div>
                <p className="line-clamp-3 text-gray-700 dark:text-gray-300">
                    {post.content.replace(/<[^>]+>/g, '')}
                </p>
            </div>
            <div className="mt-4">
                {post?.tags?.slice(0, 3).map((tag, index) => (
                    <span
                        key={index}
                        className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2 transition-colors"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    </Link>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
    <div className="text-center p-4">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
);

const AuthorPage = () => {
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorPosts, setAuthorPosts] = useState<BlogPostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isDarkMode: darkMode, toggleDarkMode } = useTheme();
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchAuthorAndPosts = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const [authorResponse, postsResponse] = await Promise.all([
                    fetch(`/api/user/${id}`),
                    fetch(`/api/blogpost?email=${author?.email}`)
                ]);

                if (!authorResponse.ok) {
                    throw new Error(`Failed to fetch author data: ${authorResponse.statusText}`);
                }
                if (!postsResponse.ok) {
                    throw new Error(`Failed to fetch posts: ${postsResponse.statusText}`);
                }

                const [authorData, postsData] = await Promise.all([
                    authorResponse.json(),
                    postsResponse.json()
                ]);

                setAuthor(authorData.user);
                setAuthorPosts(postsData.blogs);
            } catch (error: any) {
                console.error('Error fetching data:', error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthorAndPosts();
    }, [id, author?.email]);

    const handleSocialLinkClick = (url?: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener noreferrer');
        }
    };

    if (isLoading) {
        return <AuthorLoadingSkeleton />;
    }

    if (!author) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl font-bold mb-4">Author not found</h2>
                <Button onClick={() => router.push('/blogs')}>Return to Blogs</Button>
            </div>
        );
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <header className="flex justify-between items-center mb-8">
                        <nav className="flex items-center space-x-4">
                            <Button
                                onClick={() => router.push('/blogs')}
                                variant="outline"
                                size="icon"
                                className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="breadcrumbs">
                                <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    Author
                                </Link>
                                <span className="mx-2">/</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{author.name}</span>
                            </div>
                        </nav>
                        <Button
                            onClick={toggleDarkMode}
                            variant="outline"
                            size="icon"
                            className="hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    </header>

                    <main>
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                    <Avatar className="w-24 h-24 ring-2 ring-gray-200 dark:ring-gray-700">
                                        <AvatarImage src={author.image} alt={author.name} />
                                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                                            {author.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center md:text-left flex-1">
                                        <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                                            {author.bio || 'No bio available'}
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            <Button variant="outline" size="sm" className="group">
                                                <Mail className="h-4 w-4 mr-2 group-hover:text-blue-600" />
                                                <span className="truncate max-w-[200px]">{author.email}</span>
                                            </Button>
                                            {author.website && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSocialLinkClick(author.website)}
                                                    className="group"
                                                >
                                                    <Globe className="h-4 w-4 mr-2 group-hover:text-blue-600" />
                                                    Website
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {author.socialLinks && (
                                    <div className="flex justify-center md:justify-start space-x-2 mt-4">
                                        {Object.entries(author.socialLinks).map(([platform, url]) => {
                                            if (!url) return null;
                                            const Icon = {
                                                facebook: Facebook,
                                                twitter: Twitter,
                                                linkedin: SiLinkedin
                                            }[platform];
                                            return Icon && (
                                                <Button
                                                    key={platform}
                                                    onClick={() => handleSocialLinkClick(url)}
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>
                                    Posts by {author.name}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                        ({authorPosts.length})
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {authorPosts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {authorPosts.map((post) => (
                                            <PostCard key={post._id} post={post} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <p>No posts available from this author yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <NewsLetter />
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AuthorPage;

const AuthorLoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-4 flex-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-2xl" />
                    <Skeleton className="h-4 w-full max-w-xl" />
                    <div className="flex space-x-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);