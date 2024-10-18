
// File: components/BlogPostContent.tsx
import React from 'react';

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


interface BlogPostContentProps {
  post: Post;
}

const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <div
      className="prose lg:prose-xl mb-8 max-w-none"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  );
};

export default BlogPostContent;

