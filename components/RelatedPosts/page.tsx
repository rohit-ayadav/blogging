import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostType } from '@/types/blogs-types';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPostType[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) return null;

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

  return (
    <Card className="mb-8 overflow-hidden border-0 shadow-md dark:bg-gray-800/50">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-gradient">
          <Tag className="h-5 w-5 text-purple-500" />
          Related Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <Link
              href={`/blogs/${post._id}`}
              key={post._id}
              className="group block"
            >
              <article className="h-full flex flex-col rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                {post.thumbnail && (
                  <div className="relative w-full pt-[56.25%] overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={post.thumbnail}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-grow p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                    {stripHtml(post.content)}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.createdAt}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>

                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more
                      <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </CardContent>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(to right, #6366f1, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .dark .text-gradient {
          background: linear-gradient(to right, #a5b4fc, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </Card>
  );
};

export default RelatedPosts;