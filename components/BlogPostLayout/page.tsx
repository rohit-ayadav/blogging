"use client";
import React, { ReactNode, Suspense, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Home, ChevronRight, Share2, Table } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import BlogPostClientContent from '../BlogPostContent/page';
import { BlogPostType } from '@/types/blogs-types';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import toast from 'react-hot-toast';
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/component/newsletter';
import { NavigationButton, Breadcrumb } from './LayoutComponent';
import useBlogPost from '@/hooks/useBlogPost';
import TableOfContents from '../AuthorPosts/TableOfContents';

interface BlogPostLayoutProps {
  children: ReactNode;
  post: BlogPostType;
  isLoading?: boolean;
  id: string;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  children,
  post,
  isLoading = false,
  id,
}) => {
  const { relatedPosts, authorPosts, author } = useBlogPost(id, post);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content.split(' ').slice(0, 20).join(' '),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      "bg-white dark:bg-gray-900",
      "text-gray-900 dark:text-white"
    )}>
      {/* Header Section */}
      <header className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
      )}>
        <div className="container mx-auto px-4 lg:px-8 py-3 md:py-4">
          <nav className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <NavigationButton
                onClick={() => router.back()}
                label="Go back"
                icon={ArrowLeft}
              />

              <div className="flex items-center gap-1 md:gap-2 text-sm overflow-x-auto hide-scrollbar">
                <Breadcrumb href="/">
                  <Home className="h-4 w-4 md:mr-1 flex-shrink-0" />
                  <span className="hidden md:inline">Home</span>
                </Breadcrumb>

                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />

                <Breadcrumb href="/blogs">Blog</Breadcrumb>

                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />

                <div className="relative flex-1 min-w-0">
                  {isLoading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    <span
                      className="text-gray-900 dark:text-white font-medium block truncate 
                               md:overflow-visible md:whitespace-normal"
                      title={post?.title}
                    >
                      {post?.title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <NavigationButton
                onClick={handleShare}
                label="Share this post"
                icon={Share2}
              />

              <NavigationButton
                onClick={toggleDarkMode}
                label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                icon={isDarkMode ? Sun : Moon}
              />
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article className="prose dark:prose-invert max-w-none">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : (
                <BlogPostClientContent initialData={post} id={post._id} />
              )}
            </article>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-16">

              {!isLoading && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <TableOfContents content={post.content} contentType={post.language as 'html' | 'markdown'} />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <AuthorPosts author={author} posts={authorPosts} />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <RelatedPosts posts={relatedPosts} />
                  </div>

                  <Suspense fallback={<SectionSkeleton />}>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <NewsLetter />
                    </div>
                  </Suspense>
                </>
              )}
            </div>
          </aside>
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

const SectionSkeleton = () => (
  <div className="space-y-4 px-4">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-3">
      {Array(3).fill(null).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export default BlogPostLayout;