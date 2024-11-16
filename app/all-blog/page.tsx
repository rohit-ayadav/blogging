"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Eye, Heart, Star, Globe } from 'lucide-react';

type BlogPostType = {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    thumbnail?: string;
    views?: number;
    likes?: number;
    category: string;
    score?: number;
    slug: string;
    language: string;
};

const BlogListing = () => {
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/blog?admin=true');
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                setPosts(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>


            {/* Show all content of blog posts here in valid format help for debugging  */}
            <div>
                {posts.map((post) => (
                    <Card key={post._id}>
                        <CardHeader>
                            <CardTitle>
                                S.No: {post._id} - {post.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{post.content.slice(0, 50)}...</p>
                            <p>Created by: {post.createdBy}</p>
                            <p>Created at: {formatDate(post.createdAt)}</p>
                            <p>Category: {post.category}</p>
                            <p>Language: {post.language}</p>
                            {/* <p>Tags: {post.tags?.join(', ')}</p> */}
                            <p>Views: {post.views}</p>
                            <p>Likes: {post.likes}</p>
                            {/* <p>Score: {post.score}</p> */}
                            {/* <a href={`/blogs/${post.slug}`}> // open the blog post in new tab */}
                            <a href={`/blogs/${post.slug}`}>
                                <p>Slug: {post.slug}</p></a>
                            <p>Thumbnail: {post.thumbnail}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default BlogListing;