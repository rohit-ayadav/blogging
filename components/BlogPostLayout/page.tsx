"use client";
import React, { ReactNode, Suspense } from 'react';
import { ArrowLeft, Moon, Sun, Home, ChevronRight, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Author, BlogPostType } from '@/types/blogs-types';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import toast from 'react-hot-toast';
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/component/newsletter';
import TableOfContents from '../AuthorPosts/TableOfContents';
import { useTheme } from '@/context/ThemeContext';
import { Breadcrumb, NavigationButton } from './LayoutComponent';
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

// Smaller components broken out for better organization and reusability
const Header: React.FC<{
  post: BlogPostType;
  isLoading?: boolean;
  onShare: () => Promise<void>;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}> = ({ post, isLoading, onShare, isDarkMode, onToggleTheme }) => {
  const router = useRouter();

  return (
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
            <BreadcrumbTrail post={post} isLoading={isLoading} />
          </div>
          <div className="flex items-center gap-2">
            <NavigationButton
              onClick={onShare}
              label="Share this post"
              icon={Share2}
            />
            <NavigationButton
              onClick={onToggleTheme}
              label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              icon={isDarkMode ? Sun : Moon}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

const BreadcrumbTrail: React.FC<{ post: BlogPostType; isLoading?: boolean }> = ({ post, isLoading }) => (
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
);

const Sidebar: React.FC<{ post: BlogPostType; author: Author; authorPosts: BlogPostType[]; relatedPosts: BlogPostType[] }> =
  ({ post, author, authorPosts, relatedPosts }) => (
    <aside className="lg:col-span-4">
      <div className="sticky top-16 space-y-8">
        <SidebarSection>
          <TableOfContents
            content={post.content}
            contentType={post.language as 'html' | 'markdown'}
          />
        </SidebarSection>
        <SidebarSection>
          <AuthorPosts author={author} posts={authorPosts} />
        </SidebarSection>
        <SidebarSection>
          <RelatedPosts posts={relatedPosts} />
        </SidebarSection>
        <Suspense fallback={<SectionSkeleton />}>
          <SidebarSection>
            <NewsLetter />
          </SidebarSection>
        </Suspense>
      </div>
    </aside>
  );

const SidebarSection: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    {children}
  </div>
);

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

const SectionSkeleton = () => (
  <div className="space-y-4 px-4">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-3">
      {Array(SKELETON_COUNT).fill(null).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export default BlogPostLayout;