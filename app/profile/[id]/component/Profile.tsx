"use client";
import React, { useState, useMemo } from 'react';
import { Moon, Sun, Mail, Globe, ArrowLeft, Eye, ThumbsUp, Search, Twitter } from 'lucide-react';
import { SiFacebook, SiLinkedin } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Newsletter from '@/app/_component/newsletter';
import { ErrorBoundary } from 'react-error-boundary';
import { useTheme } from '@/context/ThemeContext';
import { PostCard } from './PostCard';
import { AuthorStats } from './AuthorStats';
import { ErrorFallback } from './ErrorFallback';
import { BlogPostType } from '@/types/blogs-types';

interface Author {
    _id: string;
    name: string;
    email: string;
    image: string;
    bio?: string;
    website?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        github?: string;
        instagram?: string;
    };
    createdAt?: string;
    totalViews?: number;
    totalLikes?: number;
}

const AuthorPage = ({ authorPosts, author }: { authorPosts: BlogPostType[], author: Author }) => {
    const { isDarkMode: darkMode, toggleDarkMode } = useTheme();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = authorPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    return (b.views || 0) - (a.views || 0);
                case 'liked':
                    return (b.likes || 0) - (a.likes || 0);
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
    }, [authorPosts, searchTerm, selectedCategory, sortBy]);

    const categories = useMemo(() =>
        ['all', ...new Set(authorPosts.map(post => post.category))],
        [authorPosts]
    );

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
                                    Blogs
                                </Link>
                                <span className="mx-2">/</span>
                                <Link href="/authors" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    Authors
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
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                                                    {author.bio || 'No bio available'}
                                                </p>
                                            </div>
                                            {author.createdAt && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Member since {new Date(author.createdAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            <Button variant="outline" size="sm" className="group">
                                                <Mail className="h-4 w-4 mr-2 group-hover:text-blue-600" />
                                                <span className="truncate max-w-[200px]">{author.email}</span>
                                            </Button>
                                            {author.website && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(author.website, '_blank', 'noopener noreferrer')}
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
                                                facebook: SiFacebook,
                                                twitter: Twitter,
                                                linkedin: SiLinkedin
                                            }[platform];
                                            return Icon && (
                                                <Button
                                                    key={platform}
                                                    onClick={() => window.open(url, '_blank', 'noopener noreferrer')}
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </Button>
                                            );
                                        })}
                                        {/* )} */}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <AuthorStats posts={authorPosts} />

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        Posts by {author.name}
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                            ({filteredAndSortedPosts.length})
                                        </span>
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search posts..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="recent">Most Recent</SelectItem>
                                                <SelectItem value="popular">Most Popular</SelectItem>
                                                <SelectItem value="liked">Most Liked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {filteredAndSortedPosts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredAndSortedPosts.map((post) => (
                                            <PostCard key={post._id} post={post} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <p>No posts found matching your criteria.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Newsletter />
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AuthorPage;
export type { Author };