import React from 'react';
import Link from 'next/link';
import { BlogPostType } from '@/types/blogs-types';
import { Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import LoadingSkeleton from '../LoadingComponent';

interface RelatedPostsProps {
  posts: BlogPostType[];
  isDarkMode: boolean;
}

const RelatedPosts = ({ posts, isDarkMode }: RelatedPostsProps) => {
  if (!posts || !posts.length) {
    return <LoadingSkeleton />;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = stripHtml(content).split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  return (
    <div className={`space-y-4 ${isDarkMode ? 'dark' : ''}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag
            className={`h-5 w-5 ${isDarkMode
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-600 hover:text-purple-700'
              }`}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Related Posts
          </h3>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.slice(0, 5).map((post) => (
          <Link
            href={`/blogs/${post.slug}`}
            key={post._id}
            className="group block"
          >
            <article
              className={`
                flex gap-4 p-3 rounded-lg transition-colors
                ${isDarkMode
                  ? 'hover:bg-gray-700/50 bg-transparent'
                  : 'hover:bg-gray-100 bg-white'
                }
              `}
            >
              {post.thumbnail && (
                <div className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4
                  className={`
                    font-medium text-sm mb-1 line-clamp-2
                    ${isDarkMode
                      ? 'text-white hover:text-purple-400'
                      : 'text-gray-900 hover:text-purple-600'
                    }
                  `}
                >
                  {post.title}
                </h4>
                <div
                  className={`
                    flex flex-wrap items-center gap-x-3 gap-y-1 text-xs
                    ${isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.createdAt}>
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length > 5 && (
        <Link
          href="/blogs"
          className={`
            inline-flex items-center text-sm transition-colors
            ${isDarkMode
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-600 hover:text-purple-800'
            }
          `}
        >
          View more related posts
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
};

export default RelatedPosts;