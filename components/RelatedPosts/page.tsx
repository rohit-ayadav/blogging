import React from 'react';
import Link from 'next/link';
import { BlogPostType } from '@/types/blogs-types';
import { Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import LoadingSkeleton from '../LoadingComponent';
import { formatDate, formatRelativeTime, getReadingTime } from '@/utils/date-formatter';

interface RelatedPostsProps {
  posts: BlogPostType[];
  isDarkMode: boolean;
  error: Error | null;
  loading: boolean;
}

const RelatedPosts = ({ posts, isDarkMode, error, loading }: RelatedPostsProps) => {
  if (error) {
    return <p className="text-red-500">Error fetching related</p>;
  }
  if (loading) {
    return <LoadingSkeleton />;
  }


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
        {!loading && posts.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No related posts found
          </p>
        )}
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
                      {formatRelativeTime(post.createdAt)}
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