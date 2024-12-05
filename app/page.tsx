"use client";

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { PenTool, Book, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { registerServiceWorkerFirstTime } from '@/hooks/push-client';
import { useBlogData, FeatureCard } from '@/hooks/useMainPageBlog';
import { BlogPostCard, SkeletonCard } from './component/BlogPostCard';


const HomePage = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { loading, posts, users, totalBlogs, totalUsers, totalLikes, totalViews } = useBlogData();

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
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BlogPostCard post={posts[0]} user={users[0]} />
              <BlogPostCard post={posts[1]} user={users[1]} />
              <BlogPostCard post={posts[2]} user={users[2]} />
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