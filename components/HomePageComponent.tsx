"use client";
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PenTool, Book, Users, ChevronRight, Search, TrendingUp, Star, Code, Terminal, Coffee } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { BlogPostCard } from '../app/_component/BlogPostCard';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BlogPostType, UserType } from '@/types/blogs-types';
import { registerServiceWorkerFirstTime } from '@/hooks/push-client';

const FeatureCard = ({ icon, title, description, action, link }: any) => {
    const { isDarkMode } = useTheme();
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={`h-full flex flex-col justify-between transition-all duration-300 
        ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'}`}>
                <CardContent className="pt-6">
                    <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
                    <CardTitle className="text-2xl font-semibold mb-2 text-center">{title}</CardTitle>
                    <p className="mb-4 text-center text-gray-600 dark:text-gray-300">{description}</p>
                </CardContent>
                <CardContent className="pt-0">
                    <Link href={link}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            {action} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const TrendingTopics = () => {
    const topics = [
        { name: 'React', icon: <Code size={14} /> },
        { name: 'TypeScript', icon: <Terminal size={14} /> },
        { name: 'Web Dev', icon: <Coffee size={14} /> },
        { name: 'AI', icon: <Star size={14} /> },
        { name: 'DevOps', icon: <TrendingUp size={14} /> }
    ];

    return (
        <div className="flex gap-2 flex-wrap justify-center">
            {topics.map((topic, index) => (
                <Link key={index} href={`/search?q=${topic.name}`}>
                    <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                        <span className="mr-1">{topic.icon}</span>
                        {topic.name}
                    </Badge>
                </Link>
            ))}
        </div>
    );
};

const SearchSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { isDarkMode } = useTheme();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() === '') return;
        router.push(`/search?q=${searchQuery}`);
    }
    return (
        <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                onFocus={(e) => e.target.select()}
                // onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
                placeholder="Search for topics, posts, or authors..."
                className={`pl-10 pr-4 py-3 w-full rounded-xl border-2 
          focus:border-blue-500 ${isDarkMode ? 'dark:focus:border-blue-400' : ''} transition-all duration-300
          bg-white ${isDarkMode ? 'dark:bg-gray-800' : ''}`}
            />
        </div>
    );
};
interface HomePageProps {
    posts: BlogPostType[];
    users: UserType[];
    totalLikes: number;
    totalViews: number;
    totalBlogs: number;
    totalUsers: number;
}

const HomePage = ({ posts, users, totalLikes, totalViews, totalBlogs, totalUsers }: HomePageProps) => {
    const { isDarkMode } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);
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

            {/* Hero Section */}
            <section className={`relative overflow-hidden py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
                <div className="container mx-auto px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
              bg-gradient-to-r from-blue-600 to-indigo-600">
                            Where Developers Share Knowledge
                        </h1>
                        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                            Join our thriving community of developers. Share insights, learn from peers,
                            and stay ahead in the tech world.
                        </p>
                        <SearchSection />
                        <div className="mt-8">
                            <TrendingTopics />
                        </div>

                        <div className="mt-12 space-x-4">
                            <Link href="/create">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    Start Writing
                                </Button>
                            </Link>
                            <Link href="/blogs">
                                <Button size="lg" variant={"default"} >
                                    Explore Blogs
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Blogs */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Featured Posts</h2>
                        <Link href="/blogs">
                            <Button variant={"default"}>View All</Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice(0, 3).map((post, index) => (
                            <motion.div
                                key={post._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <BlogPostCard
                                    post={post}
                                    user={users.find(user => user.email === post.createdBy) || { email: '', name: '', image: '', bio: '', follower: 0, following: 0, noOfBlogs: 0, createdAt: '', updatedAt: '', theme: '', _id: '', website: '', socialLinks: { linkedin: '', github: '', twitter: '', instagram: '', facebook: '' }, isEmailVerified: false, username: '', role: '' }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">Why TheFoodBlogger?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<PenTool size={48} />}
                            title="Write & Share"
                            description="Share your technical insights and experiences. Build your personal brand in tech."
                            action="Start Writing"
                            link="/create"
                        />
                        <FeatureCard
                            icon={<Book size={48} />}
                            title="Learn & Grow"
                            description="Access quality technical content. Stay updated with the latest in tech."
                            action="Start Learning"
                            link="/blogs"
                        />
                        <FeatureCard
                            icon={<Users size={48} />}
                            title="Connect & Network"
                            description="Join a community of passionate developers. Collaborate and grow together."
                            action="Join Community"
                            link="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Active Writers', value: totalUsers, icon: <PenTool /> },
                            { label: 'Articles Published', value: totalBlogs, icon: <Book /> },
                            { label: 'Total Reactions', value: totalLikes, icon: <Star /> },
                            { label: 'Monthly Readers', value: totalViews, icon: <Users /> }
                        ].map((stat, index) => (
                            <Card key={index} className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <CardContent className="pt-6">
                                    <div className="text-blue-600 mb-4">{stat.icon}</div>
                                    <div className="text-4xl font-bold text-blue-600">
                                        <CountUp end={stat.value} duration={3} />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;