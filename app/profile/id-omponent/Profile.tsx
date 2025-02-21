"use client";
import React, { useState, useMemo } from 'react';
import { Moon, Sun, Mail, Globe, ArrowLeft, Search, Twitter } from 'lucide-react';
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
import { formatDate } from '@/utils/date-formatter';

interface Author {
    _id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    bio?: string;
    website?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    createdAt?: string;
    totalViews?: number;
    totalLikes?: number;
}

const AuthorPage = ({ authorPosts, author }: { authorPosts: BlogPostType[], author: Author }) => {
    const { isDarkMode, toggleDarkMode } = useTheme();
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
            <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? 'dark' : ''}`}>
                <h2 className="text-xl font-bold mb-4">Author not found</h2>
                <Link href="/blogs"><Button>Return to Blogs</Button></Link>
            </div>
        );
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <div className={`${isDarkMode ? 'dark' : ''}`}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        <header className="flex justify-between items-center mb-8">
                            <nav className="flex items-center space-x-4">
                                <Link href="/blogs">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <div className="breadcrumbs text-sm">
                                    <Link href="/blogs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                                        Blogs
                                    </Link>
                                    <span className="mx-2 text-gray-400">/</span>
                                    <Link href="/author" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                                        Authors
                                    </Link>
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-gray-900 dark:text-gray-200 font-medium">{author.name}</span>
                                </div>
                            </nav>
                            <Button
                                onClick={toggleDarkMode}
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-200 dark:hover:bg-gray-800"
                            >
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </header>

                        <main className="space-y-8">
                            <Card className="overflow-hidden border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                        <Avatar className="w-32 h-32 ring-4 ring-blue-100 dark:ring-blue-900">
                                            <AvatarImage src={author.image} alt={author.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl">
                                                {author.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                                    {author.bio || 'No bio available'}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
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
                                            {author.socialLinks && (
                                                <div className="flex gap-2 pt-2">
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
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        {author.createdAt && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400 md:self-start">
                                                Member since {formatDate(author.createdAt)}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <AuthorStats posts={authorPosts} />

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            Posts by {author.name}
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
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
                                                    className="pl-10 bg-transparent"
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
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 dark:text-gray-400">No posts found matching your criteria.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Newsletter />
                        </main>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AuthorPage;
export type { Author };