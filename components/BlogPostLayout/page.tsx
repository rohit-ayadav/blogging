"use client";
import React, { ReactNode } from 'react';
import { Author, BlogPostType } from '@/types/blogs-types';
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { Sidebar, Header } from './LayoutComponent';
import useBlogPost from '@/hooks/useBlogPost';

const CONTENT_PREVIEW_LENGTH = 100;

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
  const { relatedPosts, authorPosts, error, loading } = useBlogPost({
    email: post.createdBy,
    category: post.category,
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
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900",
        "selection:bg-primary-500 selection:text-white"
      )}
    >
      <Header
        post={post}
        isLoading={isLoading}
        onShare={handleShare}
      />
      <main className={cn(
        "container mx-auto px-4 lg:px-8 py-8",
        isDarkMode ? "text-gray-200" : "text-gray-800"
      )}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article
              className={cn(
                "prose max-w-none",
                isDarkMode
                  ? "prose-invert prose-dark"
                  : "prose-light"
              )}
            >
              {children}
            </article>
          </div>
          {!isLoading && (
            <Sidebar
              post={post}
              author={author}
              authorPosts={authorPosts}
              error={error}
              loading={loading}
              relatedPosts={relatedPosts}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPostLayout;