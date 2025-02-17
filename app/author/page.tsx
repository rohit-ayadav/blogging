import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlobeIcon, LinkedinIcon, GithubIcon, TwitterIcon, InstagramIcon, FacebookIcon } from 'lucide-react';
import User from '@/models/users.models';
import Blog from '@/models/blogs.models';
import { ErrorMessage } from '../blogs/[id]/ErrorMessage';
import { connectDB } from '@/utils/db';

type UserType = {
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
    _id: string;
    website?: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
    };
    isEmailVerified: boolean;
    username: string;
    role: string;
};

async function getAuthorData() {
    try {
        await connectDB();
        const authors = await User.find({
            email: { $in: (await Blog.distinct('createdBy')) }
        }).lean();

        authors.forEach((author) => {
            const user = author as UserType;
            user.createdAt = user.createdAt.toString();
            user._id = user._id.toString();
        });

        return {
            success: true,
            authors: authors as UserType[],
            totalAuthors: authors.length
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message
        };
    }
}

const AuthorCard = ({ author }: { author: UserType }) => {
    const socialIcons = {
        website: <GlobeIcon className="h-5 w-5" />,
        linkedin: <LinkedinIcon className="h-5 w-5" />,
        github: <GithubIcon className="h-5 w-5" />,
        twitter: <TwitterIcon className="h-5 w-5" />,
        instagram: <InstagramIcon className="h-5 w-5" />,
        facebook: <FacebookIcon className="h-5 w-5" />
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                            src={author.image}
                            alt={author.name}
                            className="rounded-full object-cover"
                            fill
                            priority
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{author.name}</h2>
                        <p className="text-sm text-gray-500 mb-2">@{author.username}</p>
                        {author.bio && (
                            <p className="text-gray-600 mb-4 line-clamp-2">{author.bio}</p>
                        )}
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-sm text-gray-500">
                                {author.noOfBlogs} {author.noOfBlogs === 1 ? 'post' : 'posts'}
                            </span>
                            <span className="text-sm text-gray-500">
                                {author.follower} {author.follower === 1 ? 'follower' : 'followers'}
                            </span>
                            <span className="text-sm text-gray-500">
                                {author.following} following
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {author.socialLinks && Object.entries(author.socialLinks).map(([platform, url]) => (
                                url && (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        {socialIcons[platform as keyof typeof socialIcons]}
                                    </a>
                                )
                            ))}
                        </div>
                        <Link href={`/author/${author._id}`}>
                            <Button className="w-full">
                                View All Posts
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AuthorsPage = async () => {
    const { success, authors, totalAuthors, message } = await getAuthorData();

    if (!success) {
        return <ErrorMessage message={message || "An error occurred while fetching data. Please try again later."} />;
    }

    if (!authors || authors.length === 0) {
        return <ErrorMessage message="No authors found." />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Our Authors</h1>
                <p className="text-gray-600 mt-2">
                    Discover {totalAuthors} talented writer{totalAuthors === 1 ? '' : 's'} sharing their knowledge
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authors.map(author => (
                    <AuthorCard key={author._id} author={author} />
                ))}
            </div>
        </div>
    );
};

export default AuthorsPage;