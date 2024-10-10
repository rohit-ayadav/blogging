"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PenTool, Book, Users } from 'lucide-react';

const HomePage = () => {
  const featuredBlogs = [
    { title: "10 Must-Know JavaScript Tips", excerpt: "Boost your JavaScript skills with these essential tips..." },
    { title: "Getting Started with Next.js", excerpt: "Learn how to build modern web apps with Next.js..." },
    { title: "Mastering CSS Grid", excerpt: "Unlock the power of CSS Grid for responsive layouts..." },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      {/* <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">DevBlogger</div>
          <div className="space-x-4">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Blogs</Button>
            <Button variant="ghost">About</Button>
            <Button variant="outline">Sign In</Button>
            <Button>Create Account</Button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Empowering Developers and Job Seekers with the Latest Resources and Opportunities</h1>
          <p className="text-xl mb-8">Join our community of passionate developers and take your career to the next level.</p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" onClick={() => window.location.href = 'https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t'}
            >Join the Community</Button>
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/blogs'}
            >Explore Blogs</Button>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogs.map((blog, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                  <Button variant="outline" onClick={() => window.location.href = '`/blogs/${index}`'}
                  >Read More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => window.location.href = '/blogs'}
            >View All Blogs</Button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
          <p className="text-xl text-center mb-12">We're a community-driven platform dedicated to helping developers grow and succeed in their careers.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <PenTool size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold mb-2">Write Your Own Blogs</h3>
              <p>Share your knowledge and experiences with the community.</p>
              <Button className="mt-4" onClick={() => window.location.href = '/create'}>Start Writing</Button>
            </div>
            <div>
              <Book size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold mb-2">Learn from Others</h3>
              <p>Explore a wide range of topics written by expert developers.</p>
              <Button className="mt-4" onClick={() => window.location.href = '/blogs'}
              >Discover Blogs</Button>
            </div>
            <div>
              <Users size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold mb-2">Connect with Peers</h3>
              <p>Network with like-minded professionals and grow together.</p>
              <Button className="mt-4" onClick={() => window.location.href = 'https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t'}
              >Join Community</Button>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default HomePage;