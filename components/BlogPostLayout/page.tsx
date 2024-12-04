"use client";
import React, { ReactNode } from 'react';
import { Author, BlogPostType } from '@/types/blogs-types';
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { Sidebar, Header } from './LayoutComponent';
import useBlogPost from '@/hooks/useBlogPost';

// Constants
const CONTENT_PREVIEW_LENGTH = 100;
const SKELETON_COUNT = 3;

interface BlogPostLayoutProps {
  children: ReactNode;
  post: BlogPostType;
  isLoading?: boolean;
  id: string;
  author: Author;
}


const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  children,
  post,
  isLoading,
  author,
  id,
}) => {
  const { relatedPosts, authorPosts } = useBlogPost({
    email: post.createdBy,
    tags: post.tags || [],
    id
  });

  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, CONTENT_PREVIEW_LENGTH),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share content');
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      "bg-white dark:bg-gray-900",
      "text-gray-900 dark:text-white"
    )}>
      <Header
        post={post}
        isLoading={isLoading}
        onShare={handleShare}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleDarkMode}
      />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article className="prose dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
          {!isLoading && (
            <Sidebar
              post={post}
              author={author}
              authorPosts={authorPosts}
              relatedPosts={relatedPosts}
            />
          )}
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