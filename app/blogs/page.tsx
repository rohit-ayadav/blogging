"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface BlogPostType {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    image?: string;
}

interface UserType {
    email: string;
    name: string;
    profilePic: string;
}

const BlogCollection = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [users, setUsers] = useState<{ [key: string]: UserType }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/blog');
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                toast.success(data.message);
                setPosts(data.data);

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
                toast.error(`${error.message}`);
            }
        };
        fetchData();
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (posts.length === 0) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
                                            {user?.profilePic ? (
                                                <img src={user.profilePic} alt={user?.name || 'User'} className="h-8 w-8 rounded-full" />
                                            ) : (
                                                <AvatarFallback>{user?.name ? user.name[0] : 'U'}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <span className="text-sm font-medium">{user?.name || 'Unknown User'}</span>
                                    </div>
                                    {/* No. of view with eye icon*/}
                                    < Button variant="outline" size="sm" >
                                        <span className="text-sm font-medium">Views</span>
                                    </Button>

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