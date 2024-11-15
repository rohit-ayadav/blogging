import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Eye, Heart } from 'lucide-react';
import { Author, BlogPostType } from '@/types/blogs-types';

interface BlogPostHeaderProps {
  post: BlogPostType;
  author: Author;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post, author }) => {
  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        {post.thumbnail && (
          <div className="relative w-full aspect-video mb-6 md:mb-8 rounded-lg overflow-hidden">
            <img
              src={post.thumbnail}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-6 mb-6 md:mb-8 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <time dateTime={post.createdAt} className="truncate">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{readingTime} min read</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{post.likes} Likes</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{post.views || 0} Views</span>
          </div>
        </div>

        <Card className="p-4 md:p-6 mb-6 md:mb-8 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start md:items-center space-x-4">
            <Avatar className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0">
              <AvatarImage
                src={author?.image || '/default-profile.jpg'}
                alt={author?.name || 'Author'}
                className="object-cover"
              />
              <AvatarFallback className="text-lg">
                {author?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${author?._id}`}
                className="font-semibold hover:underline inline-block text-base md:text-lg mb-1"
              >
                {author?.name || 'Anonymous'}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {author?.bio || 'No bio available'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </header>
  );
};

export default BlogPostHeader;