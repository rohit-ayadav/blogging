"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, ThumbsUp, Clock, Calendar, ArrowLeft, ThumbsUp as ThumbsUpFilled, Eye } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiWhatsapp, SiX } from 'react-icons/si';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { set } from 'mongoose';

interface Post {
    _id: string;
    title: string;
    image?: string;
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

const IndividualBlogPost = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [likes, setLikes] = useState(0);
    const [post, setPost] = useState<Post | null>(null);
    const [liked, setLiked] = useState(false);
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorPosts, setAuthorPosts] = useState<Post[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [views, setViews] = useState(0);

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchPostAndRelatedData = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/blog/${id}`);
                    if (!response.ok) {
                        throw new Error(`${response.status} - ${response.statusText}`);
                    }
                    const data = await response.json();
                    setPost(data.data);
                    setLiked(data.data.likes > 0);
                    setViews(data.data.views);

                    const authorResponse = await fetch(`/api/user?email=${data.data.createdBy}`);
                    if (!authorResponse.ok) {
                        throw new Error(`${authorResponse.status} - ${authorResponse.statusText}`);
                    }
                    const authorData = await authorResponse.json();
                    setAuthor(authorData.user);
                    setLikes(data.data.likes);

                    // Fetch author's other posts
                    const authorPostsResponse = await fetch(`/api/blog?author=${data.data.createdBy}&limit=3`);
                    if (!authorPostsResponse.ok) {
                        throw new Error(`${authorPostsResponse.status} - ${authorPostsResponse.statusText}`);
                    }
                    const authorPostsData = await authorPostsResponse.json();
                    setAuthorPosts(authorPostsData.data.filter((p: Post) => p._id !== id));

                    // Fetch related posts (based on tags)
                    const relatedPostsResponse = await fetch(`/api/blog?tags=${data.data.tags.join(',')}&limit=3`);
                    if (!relatedPostsResponse.ok) {
                        throw new Error(`${relatedPostsResponse.status} - ${relatedPostsResponse.statusText}`);
                    }
                    const relatedPostsData = await relatedPostsResponse.json();
                    setRelatedPosts(relatedPostsData.data.filter((p: Post) => p._id !== id));

                } catch (error: any) {
                    console.error('Error fetching data:', error);
                    toast.error(`Failed to fetch data: ${error.message}`);
                }
            }
        };
        fetchPostAndRelatedData();
    }, [id]);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const handleLike = async () => {
        if (!liked) {
            try {
                const response = await fetch(`/api/blog/${id}/like`, {
                    method: 'POST',
                });
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                setLikes(likes + 1);
                setLiked(true);
            } catch (error: any) {
                console.error('Error liking post:', error);
                toast.error(`Failed to like post: ${error.message}`);
            }
        }
        else {
            try {
                const response = await fetch(`/api/blog/${id}/dislike`, {
                    method: 'POST',
                });
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                setLikes(likes - 1);
                setLiked(false);
            } catch (error: any) {
                console.error('Error liking post:', error);
                toast.error(`Failed to like post: ${error.message}`);
            }
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (!post) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{post.title} | Your Blog Name</title>
                <meta name="description" content={post.content.slice(0, 160)} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.content.slice(0, 160)} />
                <meta property="og:image" content={post.image || '/default-og-image.jpg'} />
                <meta property="og:url" content={shareUrl} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-4">
                            <Button onClick={() => router.push('/blogs')} variant="outline" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <Link href="/blogs" className="text-sm text-gray-500 hover:underline">Blog/</Link><Link href={`/blogs/${post._id}`} className="text-sm text-gray-500 hover:underline"> {post.title}</Link>
                            </div>
                        </div>
                        <Button onClick={toggleDarkMode} variant="outline" size="icon">
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold">{post.title}</h1>
                    </div>

                    {post.image && (
                        <img src={post.image} alt={post.title} className="w-full max-h-96 object-cover mb-8 rounded-lg" />
                    )}

                    <div className="flex flex-wrap items-center space-x-4 mb-8">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Reading time: {Math.ceil(post.content.split(' ').length / 200)} mins</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{likes} Likes</span>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <Eye className="h-4 w-4" />
                            <span>{views || 0} Views</span>
                        </div>
                    </div>

                    <Card className="p-6 mb-8">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                {author?.image ? (
                                    <AvatarImage src={author.image} alt={author.name} />
                                ) : (
                                    <AvatarImage src="/default-profile.jpg" alt={author?.name || 'Default Name'} />
                                )}
                                {liked ? <ThumbsUpFilled className="h-4 w-4 mr-2" /> : <ThumbsUp className="h-4 w-4 mr-2" />}
                            </Avatar>
                            <div>
                                <Link href={`/profile/${author?._id}`} className="font-semibold hover:underline">
                                    {author?.name || 'Author Name'}
                                </Link>
                                <p className="text-sm text-gray-500">{author?.bio || 'Author bio placeholder'}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="prose lg:prose-xl mb-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                   
                    <div className="flex flex-col md:flex-row justify-between items-center m-8 mt-10">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                                <Button variant={liked ? 'default' : 'outline'} onClick={handleLike}>
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    Like({likes})
                                </Button>
                                <Button variant="outline">
                                    views {views ? views : 0}
                                </Button>
                            </div>
                        </div>

                        <br />
                        <div className="flex items-center space-x-2">

                            <span>Share:</span>
                            <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out this amazing post: " + post.title + " " + shareUrl)}`, '_blank')} variant="outline">
                                <SiWhatsapp className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')} variant="outline">
                                <SiFacebook className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`, '_blank')} variant="outline">
                                <SiX className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`, '_blank')} variant="outline">
                                <SiLinkedin size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags && post.tags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {tag}
                            </span>

                        ))}
                    </div>

                    {relatedPosts.length > 0 && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Related Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {relatedPosts.slice(0, 3).map((post) => (
                                        <Link href={`/blogs/${post._id}`} key={post._id}>
                                            <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                                <h3 className="font-semibold">{post.title}</h3>
                                                {/* // post preview */}
                                                <p className="line-clamp-3">{post.content.replace(/<[^>]+>/g, '')}</p>
                                                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                        <div className="flex items-center space-x-2">
                            <Input type="text" placeholder="Write a comment..." />
                            <Button>Post</Button>
                        </div>
                    </div>
                    {authorPosts.length > 0 && (
                        <Card className="mb-8 mt-6">
                            <CardHeader>
                                <CardTitle>More from {author?.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {authorPosts.slice(0, 3).map((post) => (
                                        <Link href={`/blogs/${post._id}`} key={post._id}>
                                            <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                                <h3 className="font-semibold">{post.title}</h3>
                                                {/* // post preview */}
                                                <p className="line-clamp-3">{post.content.replace(/<[^>]+>/g, '')}</p>
                                                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default IndividualBlogPost;
