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
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-0 leading-tight">
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

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-6 mb-2 md:mb-4 text-sm">
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
        <div className="flex items-center gap-3 md:gap-6 mb-2 md:mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Link href={`/profile/${author?._id}`} className="group block no-underline">
              <span className='font-bold text-gray-900 dark:text-white no-underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
              >{author?.name || 'Anonymous'}</span>
            </Link>
          </div>
        </div>

        {/* <Card className="group p-4 sm:p-6 mb-4 sm:mb-6 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-gray-100 dark:ring-gray-700 transition-transform duration-300 group-hover:scale-105">
              <AvatarImage
                src={author?.image || '/default-profile.jpg'}
                alt={author?.name || 'Author'}
                className="object-cover rounded-full"
              />
              <AvatarFallback className="text-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {author?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
              <Link
                href={`/profile/${author?._id}`}
                className="inline-block font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {author?.name || 'Anonymous'}
              </Link>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {author?.bio || 'No bio available'}
              </p>
            </div>
          </div>
        </Card> */}
      </div>
    </header>
  );
};

export default BlogPostHeader;