"use client";
import React, { useEffect, useState } from 'react';
import { Moon, Sun, ThumbsUp, Clock, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

interface Post {
    _id: string;
    title: string;
    content: string;
    status: string;
    tags: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    readingTime: number;
    date: string;
    categories: string[];
    author: {
        avatar: string;
        name: string;
        bio: string;
    };
}
const BlogPost = () => {
    const [post, setPost] = useState<Post | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/blog');
            const data = await response.json();
            toast.success(data.message);
            setPost(data.blog);
            console.log(data);
        };
        fetchData();
    }, []);
    const [darkMode, setDarkMode] = useState(false);
    const [likes, setLikes] = useState(0);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    const handleLike = () => {
        setLikes(likes + 1);
    };
    
    return (
        <>
            <div className={`container mx-auto p-4 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={toggleDarkMode} variant="outline">
                        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                </div>
                {post && post.categories && (
                    <>
                        <Clock className="h-4 w-4" />
                        <span>{post.readingTime} min read</span>
                        <Calendar className="h-4 w-4 ml-2" />
                        <span>Published on {post.date}</span>
                    </>
                )}
            </div>

            <div className="flex space-x-2 mb-4">
                {post && post.categories && post.categories.map((category, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {category}
                    </span>
                ))}
            </div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                    <Button onClick={handleLike} variant="outline">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Like ({likes})
                    </Button>
                    <Button variant="outline" />
                    {post && post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="text-sm text-gray-500">#{tag}</span>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    {post && post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="text-sm text-gray-500">#{tag}</span>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    {post && post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="text-sm text-gray-500">#{tag}</span>
                    ))}
                </div>
                {post && post.author && (
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{post.author.name}</h3>
                            <p className="text-sm text-gray-500">{post.author.bio}</p>
                        </div>
                    </div>
                )}
            </div>
            {post && (
                <Card className="p-4 mb-8">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </Card>
            )}
            <Alert>
                <AlertTitle>Stay updated!</AlertTitle>
                <AlertDescription>
                    <div className="mt-2 flex space-x-2">
                        <Input type="email" placeholder="Enter your email" />
                        <Button>Subscribe</Button>
                    </div>
                </AlertDescription>
            </Alert>
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {/* Add your comment system here */}
            </div>
        </>
    );
}
export default BlogPost;
