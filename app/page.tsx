"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PenTool, Book, Users } from 'lucide-react';
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

interface UserType {
  email: string;
  // Add other user properties here
}

const HomePage: React.FC = () => {
  const [errorState, setErrorState] = useState(false);
  // const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [users, setUsers] = useState<{ [key: string]: UserType }>({});
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorState(false);
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error(`${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setPosts(data.data);
        setLikes(data.likes);
        setViews(data.views);
        setPosts(data.data.slice(0, 3));

        // Fetch user details
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
        userDetails.forEach((user: UserType) => {
          userMap[user.email] = user;
        });
        setUsers(userMap);
      } catch (error) {
        setErrorState(true);
        toast.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 md:text-5xl">Empowering Developers and Job Seekers with the Latest Resources and Opportunities</h1>
          <p className="text-xl mb-8 md:text-2xl">Join our community of passionate developers and take your career to the next level.</p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <Button size="lg" variant="secondary" onClick={() => window.location.href = 'https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t'}
            >Join the Community</Button>
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/blogs'}
            >Explore Blogs</Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((blog, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  
                <p className="line-clamp-3">{blog.content.replace(/<[^>]+>/g, '')}</p>
                  <Button variant="outline" onClick={() => window.location.href = `/blogs/${index}`}
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