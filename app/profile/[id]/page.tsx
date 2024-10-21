"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Mail, Globe, ArrowLeft, Eye, ThumbsUp, Facebook, Twitter } from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NewsLetter from '../../component/newsletter';

interface Author {
    _id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    website?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
}

interface Post {
    _id: string;
    title: string;
    createdAt: string;
    tags: string[];
    content: string;
    likes: number;
    views: number;
}

const AuthorPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorPosts, setAuthorPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchAuthorAndPosts = async () => {
            if (id) {
                try {
                    setError('');
                    const authorResponse = await fetch(`/api/user/${id}`);
                    if (!authorResponse.ok) {
                        throw new Error(`${authorResponse.status} - ${authorResponse.statusText}`);
                    }
                    const authorData = await authorResponse.json();
                    setAuthor(authorData.user);

                    const postsResponse = await fetch(`/api/blogpost?email=${authorData.user.email}`);
                    if (!postsResponse.ok) {
                        throw new Error(`${postsResponse.status} - ${postsResponse.statusText}`);
                    }
                    const postsData = await postsResponse.json();
                    setAuthorPosts(postsData.blogs);

                } catch (error: any) {
                    console.error('Error fetching data:', error);
                    toast.error(`Failed to fetch data: ${error.message}`);
                    setError(`Failed to fetch data: ${error.message}`);
                }
            }
        };
        fetchAuthorAndPosts();
    }, [id]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    if (!author) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-4">
                            <Button onClick={() => router.push('/blogs')} variant="outline" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <Link href="/blogs" className="text-sm text-gray-500 hover:underline">Author/</Link>
                                <Link href={`/profile/${author._id}`} className="text-sm text-gray-500 hover:underline"> {author.name}</Link>
                            </div>
                        </div>
                        <Button onClick={toggleDarkMode} variant="outline" size="icon">
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={author.image} alt={author.name} />
                                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{author.bio ? author.bio : 'No bio found'}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start space-x-2">
                                        <Button variant="outline" size="sm">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {author.email}
                                        </Button>
                                        {author.website && (
                                            <Button variant="outline" size="sm" onClick={() => author.website && router.push(author.website)}>
                                                <Globe className="h-4 w-4 mr-2" />
                                                Website
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {author.socialLinks && (
                                <div className="flex justify-center md:justify-start space-x-2 mt-4">
                                    {author.socialLinks.facebook && (
                                        <Button onClick={() => author.socialLinks?.facebook && router.push(author.socialLinks.facebook)}
                                            variant="outline" size="icon">
                                            <Facebook className="h-4 w-4" />
                                        </Button>

                                    )}
                                    {author.socialLinks.twitter && (
                                        <Button onClick={() => author.socialLinks?.twitter && router.push(author.socialLinks.twitter)}
                                            variant="outline" size="icon">
                                            <Twitter className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {author.socialLinks.linkedin && (
                                        <Button onClick={() => author.socialLinks?.linkedin && router.push(author.socialLinks.linkedin)}
                                            variant="outline" size="icon">
                                            <SiLinkedin size={16} />
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Posts by {author.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {authorPosts && authorPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {authorPosts.map((post) => (
                                        <Link href={`/blogs/${post._id}`} key={post._id}>
                                            <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                                <h3 className="font-semibold">{post.title}</h3>
                                                <div className="flex items-center space-x-2 mt-2 mb-4">
                                                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>

                                                    <div className="flex items-center space-x-2">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{post.views ? post.views : 0}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <ThumbsUp className="h-4 w-4" />
                                                        <span>{post.likes ? post.likes : 0}</span>
                                                    </div>
                                                </div>
                                                <p className="line-clamp-3">{post.content.replace(/<[^>]+>/g, '')}</p>

                                                <div className="mt-2">
                                                    {post.tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p>No posts found for this author.</p>
                            )}
                        </CardContent>
                    </Card>

                    <NewsLetter />
                </div>
            </div>
        </>
    );
};

export default AuthorPage;
