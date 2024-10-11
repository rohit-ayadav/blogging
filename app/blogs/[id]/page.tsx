"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Moon, Sun, ThumbsUp, Share2, Clock, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

interface Post {
    title: string;
    image?: string;
    createdAt: string;
    content: string;
    tags: string[];
    createdBy: string;
}

const IndividualBlogPost = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [likes, setLikes] = useState(0);
    const [post, setPost] = useState<Post | null>(null);

    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/blog/${id}`);
                    if (!response.ok) {
                        throw new Error(`${response.status} - ${response.statusText}`);
                    }
                    const data = await response.json();
                    setPost(data.data);
                } catch (error: any) {
                    console.error('Error fetching blog post:', error);
                    toast.error(`Failed to fetch blog post: ${error.message}`);
                }
            }
        };
        fetchPost();
    }, [id]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLike = () => {
        setLikes(likes + 1);
    };

    if (!post) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">{post.title}</h1>
                    <Button onClick={toggleDarkMode} variant="outline" size="icon">
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                {post.image && (
                    <img src={post.image} alt={post.title} className="w-full max-h-96 object-cover mb-8 rounded-lg" />
                )}

                <div className="flex items-center space-x-4 mb-8">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Reading time placeholder</span>
                    </div>
                </div>

                <div className="prose lg:prose-xl mb-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <Button onClick={handleLike} variant="outline">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Like ({likes})
                        </Button>
                        <Button variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {post.tags && post.tags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <Card className="p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarFallback>{post.createdBy[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{post.createdBy}</h3>
                            <p className="text-sm text-gray-500">Author bio placeholder</p>
                        </div>
                    </div>
                </Card>

                <Alert className="mb-8">
                    <AlertTitle>Stay updated!</AlertTitle>
                    <AlertDescription>
                        <div className="mt-2 flex space-x-2">
                            <Input type="email" placeholder="Enter your email" />
                            <Button>Subscribe</Button>
                        </div>
                    </AlertDescription>
                </Alert>

                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">Comments</h3>
                    {/* Add your comment system here */}
                </div>
            </div>
        </div>
    );
};

export default IndividualBlogPost;