"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Eye, Heart, Star, Globe } from 'lucide-react';
import { CodeBlock } from '@/components/BlogPostContent011/component/CodeBlock';
import { BlogPostType } from '@/types/blogs-types';
import { useTheme } from '@/context/ThemeContext';
import Newsletter from '../component/newsletter';

const BlogListing = () => {
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isDarkMode, toggleDarkMode } = useTheme();

    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             const response = await fetch('/api/blog?admin=true');
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch blog posts');
    //             }
    //             const data = await response.json();
    //             setPosts(data.data);
    //         } catch (err) {
    //             setError(err instanceof Error ? err.message : 'An error occurred');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchPosts();
    // }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center min-h-[400px]">
    //             <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    //         </div>
    //     );
    // }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                Error: {error}
            </div>
        );
    }

    const briefCode = `// 100 lines of code for a brief code block 100 lines of code for a brief code block 100 lines of code for a brief code block
const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const subtract = (a, b) => a - b;
const square = (a) => a * a;
const cube = (a) => a * a * a;
const factorial = (a) => {

    if (a === 0) {
        return 1;
    }

    return a * factorial(a - 1);
}

const isPrime = (num) => {
    if (num <= 1) {
        return false;
    }

    if (num <= 3) {
        return true;
    }

    if (num % 2 === 0 || num % 3 === 0) {
        return false;
    }

    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }

    return true;
}



    `;
    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">

            <Newsletter />

            <button onClick={toggleDarkMode} className="flex items-center space-x-2">
                <Globe className="w-6 h-6" />
                <span>Toggle Dark Mode</span>
            </button>


            {/* // Code Block */}
            <h1 className="text-3xl font-bold mb-8">Code Block</h1>
            {/* // test code block for scrolling */}
            <div className="max-w-xl mx-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <CodeBlock
                    code={briefCode.trim()}
                    language="javascript"
                    isDarkMode={isDarkMode}
                />
            </div>

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
                            {/* <p>{post.content.slice(0, 50)}...</p> */}
                            <p>Created by: {post.createdBy}</p>
                            <p>Created at: {formatDate(post.createdAt)}</p>
                            <p>Category: {post.category}</p>
                            <p>Language: {post.language}</p>
                            {/* <p>Tags: {post.tags?.join(', ')}</p> */}
                            <p>Views: {post.views}</p>
                            <p>Likes: {post.likes}</p>
                            {/* <p>Score: {post.score}</p> */}
                            <a href={`/blogs/${post.slug}`}>
                                <p>Slug: {post.slug}</p>
                            </a>
                            <p>Thumbnail: {post.thumbnail}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div >
    );
}

export default BlogListing;