"use client";

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { PenTool, Book, Users, ChevronRight } from 'lucide-react';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { registerServiceWorkerFirstTime } from '@/hooks/push-client';
import { BlogPostCard } from '../app/_component/BlogPostCard';
import { BlogPostType, UserType } from '@/types/blogs-types';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Define interfaces at the top
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    link: string;
}

interface HomePageProps {
    posts: BlogPostType[];
    users: UserType[];
    totalLikes: number;
    totalViews: number;
    totalBlogs: number;
    totalUsers: number;
}

// Separate FeatureCard component with fixed button implementation
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, action, link }) => {
    const { isDarkMode } = useTheme();
    return (
        <Card className={`text-center h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <CardContent className="pt-6">
                <div className="text-blue-600 mb-4">{icon}</div>
                <CardTitle className="text-2xl font-semibold mb-2">{title}</CardTitle>
                <p className="mb-4">{description}</p>
            </CardContent>
            <CardContent className="pt-0">
                <div className="w-full">
                    <Link href={link}>
                        <Button className="w-full">
                            {action} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

const HomePage: React.FC<HomePageProps> = ({ posts, users, totalLikes, totalViews, totalBlogs, totalUsers }) => {
    const { isDarkMode } = useTheme();
    const router = useRouter();

    useEffect(() => {
        registerServiceWorkerFirstTime();
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <ToastContainer />
            <section className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 ${isDarkMode ? 'from-blue-800 to-blue-900' : ''}`}>
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold mb-4 md:text-5xl lg:text-6xl">Empower Your Developer Journey</h1>
                    <p className="text-xl mb-8 md:text-2xl max-w-3xl mx-auto">Join our thriving community of passionate developers. Share knowledge, learn from peers, and accelerate your career growth.</p>
                    <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
                        <Link href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t">
                            <Button
                                size="lg"
                                variant={isDarkMode ? "outline" : "secondary"}
                            >
                                Join the Community
                            </Button>
                        </Link>
                        <Link href="/blogs">
                            <Button
                                size="lg"
                                variant={isDarkMode ? "outline" : "secondary"}
                            >
                                Explore Blogs
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Blogs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {posts.slice(0, 3).map((post, index) => (
                            <BlogPostCard key={post._id || index} post={post} user={users.find(user => user.email === post.createdBy) as UserType || {} as UserType} />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/blogs">
                            <Button size="lg">
                                View All Blogs
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
                    <p className="text-xl text-center mb-12 max-w-3xl mx-auto">We're a community-driven platform dedicated to helping developers grow and succeed in their careers. Join us to share knowledge, learn from others, and connect with like-minded professionals.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<PenTool size={48} className="text-blue-600 mx-auto" />}
                            title="Write Your Own Blogs"
                            description="Share your knowledge and experiences with the community. Establish yourself as an expert in your field."
                            action="Start Writing"
                            link="/create"
                        />
                        <FeatureCard
                            icon={<Book size={48} className="mx-auto text-blue-600" />}
                            title="Learn from Others"
                            description="Explore a wide range of topics written by expert developers. Stay updated with the latest trends and technologies."
                            action="Discover Blogs"
                            link="/blogs"
                        />
                        <FeatureCard
                            icon={<Users size={48} className="mx-auto text-blue-600" />}
                            title="Connect with Peers"
                            description="Network with like-minded professionals and grow together. Collaborate on projects and share opportunities."
                            action="Join Community"
                            link='https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t'
                        />
                    </div>
                </div>
            </section>

            <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-4xl font-bold text-blue-600">
                                <CountUp end={totalBlogs} duration={5} />
                            </p>
                            <p className="text-xl">Blogs Published</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600">
                                <CountUp end={totalLikes} duration={5} />
                            </p>
                            <p className="text-xl">Total Likes</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600">
                                <CountUp end={totalViews} duration={5} />
                            </p>
                            <p className="text-xl">Total Views</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600">
                                <CountUp end={totalUsers} duration={5} />
                            </p>
                            <p className="text-xl">Active Users</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;