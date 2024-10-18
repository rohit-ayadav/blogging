
// File: components/AuthorPosts.tsx
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Post {
    _id: string;
    title: string;
    thumbnail?: string;
    createdAt: string;
    content: string;
    tags: string[];
    createdBy: string;
    likes: number;
    bio?: string;
}

interface Author {
    name: string;
    image: string;
    bio?: string;
    _id: string;
    likes: number;
    views: number;
}

interface AuthorPostsProps {
    author: Author;
    posts: Post[];
}

const AuthorPosts = ({ author, posts }: AuthorPostsProps) => {
    if (posts.length === 0) {
        return <div className='text-center'>No posts found</div>;
    }

    return (
        <Card className="mb-8 mt-6">
            <CardHeader>
                <CardTitle>More from {author?.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {posts.slice(0, 3).map((post) => (
                        <Link href={`/blogs/${post._id}`} key={post._id}>
                            <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                <h3 className="font-semibold">{post.title}</h3>
                                <p className="line-clamp-3">{post.content.replace(/<[^>]+>/g, '')}</p>
                                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AuthorPosts;