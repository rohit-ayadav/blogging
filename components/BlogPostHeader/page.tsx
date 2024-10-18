"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, Eye, Heart, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface Post {
  _id: string;
  title: string;
  thumbnail?: string;
  createdAt: string;
  content: string;
  tags: string[];
  createdBy: string;
  likes: number;
  views: number;
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


interface BlogPostHeaderProps {
  post: Post;
  author: Author;
}


const BlogPostHeader = ({ post, author }: BlogPostHeaderProps) => {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.push('/blogs')} variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Link href="/blogs" className="text-sm text-gray-500 hover:underline">Blog/</Link>
            <Link href={`/blogs/${post._id}`} className="text-sm text-gray-500 hover:underline"> {post.title}</Link>
          </div>
          {/* night mode button*/}
          <Button onClick={toggleDarkMode} variant="outline" size="icon">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{post.title}</h1>
      </div>
      {post.thumbnail && (
        <img src={post.thumbnail} alt={post.title} className="w-full max-h-96 object-cover mb-8 rounded-lg" />
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
          <Heart className="h-4 w-4" />
          <span>{post.likes} Likes</span>
        </div>
        <div className='flex items-center space-x-2'>
          <Eye className="h-4 w-4" />
          <span>{post.views || 0} Views</span>
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
          </Avatar>
          <div>
            <Link href={`/profile/${author?._id}`} className="font-semibold hover:underline">
              {author?.name || 'Author Name'}
            </Link>
            <p className="text-sm text-gray-500">{author?.bio || 'Author bio placeholder'}</p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default BlogPostHeader;