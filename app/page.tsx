"use client";

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PenTool, Book, Users, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { BlogPostType, UserType } from '@/types/blogs-types';
import { usePushNotifications } from '@/hooks/push-client';


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

const useBlogData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [users, setUsers] = useState({});
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);



  useEffect(() => {
    const fetchStats = async () => {

      try {
        const response = await fetch('/api/stats/all');
        if (!response.ok) {
          throw new Error(`${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setTotalLikes(data.totalLikes);
        setTotalViews(data.totalViews);
        setTotalBlogs(data.totalBlogs);
        setTotalUsers(parseInt(data.totalUsers));
        // toast.success(data.totalAuthors.totalBlogs);

      } catch (error: any) {
        console.error('Error fetching stats:', error);
        toast.error(error.message);
      }
    };
    fetchStats();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await fetch('/api/blog?trending');
        if (!response.ok) {
          throw new Error(`${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setPosts(data.data.slice(0, 3));
        setLoading(false);

        const userEmails = data.data.map((post: Post) => post.createdBy);
        const uniqueEmails = [...new Set(userEmails)];
        const userDetails = await Promise.all(uniqueEmails.map(async (email) => {
          const userResponse = await fetch(`/api/user?email=${email}`);
          if (!userResponse.ok) {
            throw new Error(`${userResponse.status} - ${userResponse.statusText}`);
          }
          const userData = await userResponse.json();
          return userData.data;
        }));
        const userMap: { [key: string]: UserType } = {};
        userDetails.forEach((user) => {
          userMap[user?.email] = user;
        });
        setUsers(userMap);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };
    fetchData();
  }, []);

  return { loading, error, posts, users, totalBlogs, totalLikes, totalViews, totalUsers };
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, action, onClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <Card className={`text-center h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <CardContent className="pt-6">
        <div className="text-blue-600 mb-4">{icon}</div>
        <CardTitle className="text-2xl font-semibold mb-2">{title}</CardTitle>
        <p className="mb-4">{description}</p>
      </CardContent>
      <CardContent className="pt-0">
        <Button onClick={onClick} className="w-full">
          {action} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { loading, error, posts, users, totalBlogs, totalUsers, totalLikes, totalViews } = useBlogData();
  const {
    isSupported,
    isSubscribed,
    errors,
    subscribe,
    unsubscribe,
    sendNotification
  } = usePushNotifications();

  useEffect(() => {
    // Subscribe to push notifications
    if (isSupported && !isSubscribed) {
      subscribe();
      if (errors) {
        console.error(errors);
      }

    }
  }, [isSupported, isSubscribed]);

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
            <Button size="lg" variant={isDarkMode ? "outline" : "secondary"} onClick={() => router.push('https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t')}>
              Join the Community
            </Button>
            <Button size="lg" variant={isDarkMode ? "outline" : "secondary"} onClick={() => { router.push('/blogs') }}>
              Explore Blogs
            </Button>
          </div>
        </div>
      </section>

      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Blogs</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className={isDarkMode ? 'bg-gray-700' : ''}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
            // ) : error ? (
            //   <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((blog, index) => (
                <Card key={index} className={`flex flex-col h-full transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 mb-4">{blog.content.replace(/<[^>]+>/g, '')}</p>
                    <Button variant={isDarkMode ? "outline" : "secondary"} onClick={() => router.push(`/blogs/${blog._id}`)}>
                      Read More <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => router.push('/blogs')}>
              View All Blogs
            </Button>
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
              onClick={() => router.push('/create')}
            />
            <FeatureCard
              icon={<Book size={48} className="mx-auto text-blue-600" />}
              title="Learn from Others"
              description="Explore a wide range of topics written by expert developers. Stay updated with the latest trends and technologies."
              action="Discover Blogs"
              onClick={() => router.push('/blogs')}
            />
            <FeatureCard
              icon={<Users size={48} className="mx-auto text-blue-600" />}
              title="Connect with Peers"
              description="Network with like-minded professionals and grow together. Collaborate on projects and share opportunities."
              action="Join Community"
              onClick={() => router.push('https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t')}
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
                <CountUp end={totalBlogs} duration={3} />
              </p>
              <p className="text-xl">Blogs Published</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">
                <CountUp end={totalLikes} duration={3} />
              </p>
              <p className="text-xl">Total Likes</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">
                <CountUp end={totalViews} duration={3} />
              </p>
              <p className="text-xl">Total Views</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">
                <CountUp end={totalUsers} duration={3} />
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