import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Eye, Heart } from 'lucide-react';
import { Author, BlogPostType } from '@/types/blogs-types';
import { formatDate } from '@/utils/date-formatter';

interface BlogPostHeaderProps {
  post: BlogPostType;
  author: Author;
  isDarkMode?: boolean;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  post,
  author,
  isDarkMode = false
}) => {
  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <header
      className={`
        ${isDarkMode
          ? 'bg-gray-900 text-gray-100'
          : 'bg-white text-gray-900'
        } transition-colors duration-200
      `}
    >
      <div className="container mx-auto px-4">
        <h1
          className={`
            text-2xl md:text-3xl lg:text-4xl font-bold mb-0 leading-tight
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}
        >
          {post.title}
        </h1>

        {post.thumbnail && (
          <div className="relative w-full aspect-video mb-6 md:mb-8 rounded-lg overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {post.thumbnailCredit && (
              <div className={`absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs`}>
                {/*
                https://unsplash.com/@niko_photos?utm_source=TheFoodBlogger&utm_medium=referral
                https://unsplash.com/?utm_source=TheFoodBlogger&utm_medium=referral 
                */}
                Photo by <Link href={`https://unsplash.com/@${post.thumbnailCredit}?utm_source=TheFoodBlogger&utm_medium=referral`} className='underline text-white'>{post.thumbnailCredit}</Link> on <Link href={`https://unsplash.com/?utm_source=TheFoodBlogger&utm_medium=referral`} className='underline text-white'>Unsplash</Link>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-6 mb-2 md:mb-4 text-sm">
          <div
            className={`
              flex items-center 
              ${isDarkMode
                ? 'text-gray-300'
                : 'text-gray-600'
              }
            `}
          >
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <time dateTime={formatDate(post.createdAt)}>
              {formatDate(post.createdAt)}
            </time>
          </div>

          <div
            className={`
              flex items-center 
              ${isDarkMode
                ? 'text-gray-300'
                : 'text-gray-600'
              }
            `}
          >
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{readingTime} min read</span>
          </div>

          <div
            className={`
              flex items-center 
              ${isDarkMode
                ? 'text-gray-300'
                : 'text-gray-600'
              }
            `}
          >
            <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{post.likes} Likes</span>
          </div>

          <div
            className={`
              flex items-center 
              ${isDarkMode
                ? 'text-gray-300'
                : 'text-gray-600'
              }
            `}
          >
            <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{post.views || 0} Views</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 mb-2 md:mb-4 text-sm">
          <div
            className={`
              flex items-center 
              ${isDarkMode
                ? 'text-gray-300'
                : 'text-gray-600'
              }
            `}
          >
            <Link href={`/author/${author?.username}`} className="group block no-underline">
              <span
                className={`
                  font-bold no-underline transition-colors duration-200
                  ${isDarkMode
                    ? 'text-white hover:text-blue-400'
                    : 'text-gray-900 hover:text-blue-600'
                  }
                `}
              >
                {author?.name || 'Anonymous'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header >
  );
};

export default BlogPostHeader;