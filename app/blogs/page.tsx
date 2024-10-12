"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { set } from 'mongoose';

interface BlogPostType {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    image?: string;
    views?: number;
    likes?: number;
    bio?: string;
}

interface UserType {
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
}

const BlogCollection = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [users, setUsers] = useState<{ [key: string]: UserType }>({});
    const [errorState, setErrorState] = useState(false);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setErrorState(false);
                const response = await fetch('/api/blog');
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                // toast.success(data.message);
                setPosts(data.data);
                setLikes(data.data.likes);
                setViews(data.data.views);

                // Fetch user details
                const userEmails = data.data.map((post: BlogPostType) => post.createdBy);
                const uniqueEmails = [...new Set(userEmails)];
                const userDetails = await Promise.all(uniqueEmails.map(async (email) => {
                    const userResponse = await fetch(`/api/user?email=${email}`);
                    if (!userResponse.ok) {
                        throw new Error(`${userResponse.status} - ${userResponse.statusText}`);
                    }
                    const userData = await userResponse.json();
                    return { email, ...userData.user };
                }));

                const userMap = userDetails.reduce((acc, user) => {
                    acc[user.email] = user;
                    return acc;
                }, {});
                setUsers(userMap);
            } catch (error: any) {
                console.error('Error fetching blog data:', error);
                toast.error(error.message);
                setErrorState(true);
            }
        };
        fetchData();
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (errorState) {
        return <>
            <div className="flex justify-center items-center h-screen">Failed to load data</div>;
            <p className="text-center text-red-500">
                Please check your internet connection and try again.
            </p>
        </>;
    }

    if (posts.length === 0) {
        return <div className="flex justify-center items-center h-screen">
            Loading... <div className="animate-spin h-5 w-5 ml-2 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>;
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Blog Posts</h1>
                    <Button onClick={toggleDarkMode} variant="outline" size="icon">
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => {
                        const user = users[post.createdBy];
                        return (
                            <Card key={post._id} className={`overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                {post.image && (
                                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                )}
                                <CardHeader>
                                    <CardTitle className="font-bold">{post.title}</CardTitle>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="line-clamp-3">{post.content.replace(/<[^>]+>/g, '')}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Avatar>
                                            {user?.image ? (
                                                <img src={user.image} alt={user?.name || 'User'} className="h-8 w-8 rounded-full" />
                                            ) : (
                                                <AvatarFallback>{user?.name ? user.name[0] : 'U'}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <span className="text-sm font-medium">{user?.name || 'Unknown User'}</span>
                                    </div>
                                    {/* No. of view with eye icon*/}
                                    <div className="flex items-center space-x-2">

                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm font-medium">{post.views ? post.views : 0}</span>

                                    </div>
                                    <Link href={`/blogs/${post._id}`}>
                                        <Button variant="outline" size="sm">
                                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BlogCollection;