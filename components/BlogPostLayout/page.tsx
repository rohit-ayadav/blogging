"use client";
import React, { ReactNode, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import BlogPostClientContent from '../BlogPostContent/page';
import { BlogPostType } from '@/types/blogs-types';

interface BlogPostLayoutProps {
  children: ReactNode;
  post: BlogPostType;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ children, post }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-8 py-3 md:py-4">
          <nav className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="icon"
                className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-1 md:gap-2 text-sm overflow-x-auto hide-scrollbar">
                <Link
                  href="/"
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Home className="h-4 w-4 md:mr-1 flex-shrink-0" />
                  <span className="hidden md:inline">Home</span>
                </Link>

                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

                <Link
                  href="/blogs"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white whitespace-nowrap transition-colors"
                >
                  Blog
                </Link>

                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

                <div className="relative flex-1 min-w-0">
                  <span
                    className="text-gray-900 dark:text-white font-medium block truncate md:overflow-visible md:whitespace-normal"
                    title={post?.title}
                  >
                    {post?.title}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="flex-shrink-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-6 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <BlogPostClientContent initialData={post} id={post._id} />
          </div>
        </div>
      </main>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 1200px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPostLayout;