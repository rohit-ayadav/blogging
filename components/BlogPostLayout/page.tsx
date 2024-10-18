"use client";
// File: components/BlogPostLayout.tsx
import React, { ReactNode, useEffect } from 'react';

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

const BlogPostLayout = ({ children }: BlogPostLayoutProps) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      setIsDarkMode(true);
    }
  }, []);


  return (
    <>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default BlogPostLayout;