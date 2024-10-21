import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Eye, Heart } from 'lucide-react';

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

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post, author }) => {

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4">

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.thumbnail && (
          <img src={post.thumbnail} alt="" className="w-full max-h-96 object-cover mb-8 rounded-lg" />
        )}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            <span>{post.likes} Likes</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            <span>{post.views || 0} Views</span>
          </div>
        </div>
        <Card className="p-6 mb-8 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={author?.image || '/default-profile.jpg'} alt={author?.name || 'Author'} />
              <AvatarFallback>{author?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${author?._id}`} className="font-semibold hover:underline">
                {author?.name || 'Anonymous'}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">{author?.bio || 'No bio available'}</p>
            </div>
          </div>
        </Card>
      </div>
    </header>
  );
};

export default BlogPostHeader;