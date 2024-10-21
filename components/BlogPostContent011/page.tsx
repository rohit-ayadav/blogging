import React from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '@/context/ThemeContext';

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

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  const { isDarkMode } = useTheme();

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    
    <article className="container mx-auto ">
      <div
        className={`
          prose lg:prose-xl max-w-none
          ${isDarkMode ? 'prose-invert' : ''}
          prose-headings:mb-4 prose-headings:mt-8
          prose-p:mb-4
          prose-a:text-blue-600 hover:prose-a:text-blue-500
          prose-img:rounded-lg prose-img:shadow-md
          prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded
          ${isDarkMode ? 'prose-code:bg-gray-800' : ''}
        `}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPostContent;