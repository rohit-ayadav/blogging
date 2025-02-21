
"use client";
import React, { useState } from 'react';
import { ErrorMessage } from '../blogs/[id]/ErrorMessage';
import { UserType } from '@/types/blogs-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GlobeIcon, LinkedinIcon, GithubIcon, TwitterIcon, InstagramIcon, FacebookIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

type SortOption = 'followers' | 'posts' | 'newest' | 'alphabetical';
const AuthorCard = ({ author }: { author: UserType }) => {
    const socialIcons = {
        website: <GlobeIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
        linkedin: <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
        github: <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
        twitter: <TwitterIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
        instagram: <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
        facebook: <FacebookIcon className="h-4 w-4 sm:h-5 sm:w-5" />
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 group">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                    <div className="flex justify-center mb-4 sm:mb-0">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-500 transition-all">
                            <AvatarImage
                                src={author.image}
                                alt={author.name}
                                className="object-cover"
                            />
                            <AvatarFallback
                                className="text-lg sm:text-xl bg-blue-100 text-blue-900"
                            >
                                {author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{author.name}</h2>
                        <p className="text-sm text-gray-500 mb-2">@{author.username}</p>
                        {author.bio && (
                            <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{author.bio}</p>
                        )}
                        <div className="flex justify-center sm:justify-start items-center space-x-4 mb-3">
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {author.noOfBlogs} {author.noOfBlogs === 1 ? 'post' : 'posts'}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {author.follower} {author.follower === 1 ? 'follower' : 'followers'}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {author.following} following
                            </span>
                        </div>
                        <div className="flex justify-center sm:justify-start flex-wrap gap-2 mb-4">
                            {author.socialLinks && Object.entries(author.socialLinks).map(([platform, url]) => (
                                url && (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        {socialIcons[platform as keyof typeof socialIcons]}
                                    </a>
                                )
                            ))}
                        </div>
                        <Link href={`/author/${author.username}`} className="block">
                            <Button className="w-full text-sm sm:text-base bg-blue-600 hover:bg-blue-700">
                                View All Posts
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const FilterSection = ({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    totalResults
}: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: SortOption;
    setSortBy: (option: SortOption) => void;
    totalResults: number;
}) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Search authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="followers">Most Followers</SelectItem>
                    <SelectItem value="posts">Most Posts</SelectItem>
                    <SelectItem value="newest">Newest Authors</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="mt-2 text-sm text-gray-500">
            Found {totalResults} author{totalResults === 1 ? '' : 's'}
        </div>
    </div>
);

const AuthorsPage = ({ success, authors, totalAuthors, message }: { success: boolean, authors: UserType[], totalAuthors: number, message: string }) => {
    // const { success, authors: initialAuthors, totalAuthors, message } = await getAuthorData();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

    if (!success) {
        return <ErrorMessage message={message || "An error occurred while fetching data. Please try again later."} />;
    }
    if (totalAuthors === 0) {
        return <ErrorMessage message="No authors found." />;
    }
    // Filter authors based on search query
    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort authors based on selected option
    const sortedAuthors = [...filteredAuthors].sort((a, b) => {
        switch (sortBy) {
            case 'followers':
                return b.follower - a.follower;
            case 'posts':
                return b.noOfBlogs - a.noOfBlogs;
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'alphabetical':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Authors</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                        Discover {totalAuthors} talented writer{totalAuthors === 1 ? '' : 's'} sharing their knowledge
                    </p>
                </div>

                <FilterSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    totalResults={filteredAuthors.length}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {sortedAuthors.map(author => (
                        <AuthorCard key={author._id} author={author} />
                    ))}
                </div>

                {filteredAuthors.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No authors found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorsPage;