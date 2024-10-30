"use client";
import React, { ReactNode, useEffect } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import BlogPostClientContent from '../BlogPostContent/page';
interface Post {
  _id: string;
  title: string;
  thumbnail?: string;
  createdAt: string;
  content: string;
  tags: string[];
  createdBy: string;
  likes: number;
  bio?: string;
}

interface BlogPostLayoutProps {
  children: ReactNode;
  post: Post;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ children, post }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="bg-gray-100 dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center space-x-2'>
              <Button onClick={() => router.back()} variant="outline" size="icon" className="dark:bg-gray-800 dark:text-gray-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Home/</Link>
                <Link href="/blogs" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Blog/</Link>
                <Link href={`/blogs/${post?._id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:underline"> {post?.title}</Link>
              </div>
            </div>
          </div>
          <Button onClick={toggleDarkMode} variant="outline" size="icon" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      {/* <main className="container mx-auto px-4 py-8"> */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6" style={{ marginTop: '2rem' }}>
        <BlogPostClientContent initialData={post} id={post._id} />
        {/* {children} */}
        {/* </main> */}
      </div>
    </div>
  );
};

export default BlogPostLayout;