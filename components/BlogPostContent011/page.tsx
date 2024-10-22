import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '@/context/ThemeContext';
import { Copy, Check } from 'lucide-react';

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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addCopyButtons = () => {
      if (!contentRef.current) return;

      const preElements = contentRef.current.getElementsByTagName('pre');
      
      Array.from(preElements).forEach((pre) => {
        // Only add button if it doesn't already exist
        if (!pre.querySelector('.copy-button')) {
          // Create wrapper div for positioning
          const wrapper = document.createElement('div');
          wrapper.className = 'relative group';
          pre.parentNode?.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
          
          // Create button container
          const button = document.createElement('button');
          button.className = `
            copy-button
            absolute top-4 right-4
            p-2 rounded-lg
            ${isDarkMode 
              ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
            transition-all duration-200
            group-hover:opacity-100
            border
            ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}
          `;
          
          // Create icon container
          const iconContainer = document.createElement('div');
          iconContainer.className = 'w-4 h-4 flex items-center justify-center';
          button.appendChild(iconContainer);

          // Initial copy icon
          const root = document.createElement('div');
          root.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
          iconContainer.appendChild(root);

          // Add click handler
          button.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            if (code) {
              try {
                await navigator.clipboard.writeText(code.textContent || '');
                
                // Change to check icon
                root.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                
                // Add success styles
                button.classList.add(isDarkMode ? 'bg-green-600' : 'bg-green-500');
                button.classList.add('text-white');
                
                // Reset back to copy icon and original styles after 2 seconds
                setTimeout(() => {
                  root.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
                  button.classList.remove(isDarkMode ? 'bg-green-600' : 'bg-green-500');
                  button.classList.remove('text-white');
                }, 2000);
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }
          });

          wrapper.appendChild(button);
        }
      });
    };

    // Add copy buttons after content is rendered
    addCopyButtons();
  }, [isDarkMode, post.content]);

  const sanitizedContent = DOMPurify.sanitize(post.content, {
    ALLOWED_ATTR: ['class', 'style', 'id'],
    ALLOWED_TAGS: ['p', 'code', 'pre', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                   'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span', 'br', 'div']
  });

  return (
    <article className="container mx-auto px-4 py-8">
      <div
        ref={contentRef}
        className={`
          prose lg:prose-xl max-w-none
          ${isDarkMode ? 'prose-invert' : ''}
          
          /* Base Typography */
          prose-h1:text-4xl prose-h1:font-bold prose-h1:my-6
          prose-h2:text-3xl prose-h2:font-bold prose-h2:my-6
          prose-h3:text-2xl prose-h3:font-semibold prose-h3:my-4
          prose-p:text-base prose-p:leading-relaxed prose-p:my-4
          
          /* Lists */
          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
          prose-li:my-2
          
          /* Links */
          prose-a:text-blue-500 hover:prose-a:text-blue-400
          
          /* Code Blocks */
          [&_pre]:my-6
          [&_pre]:p-6
          [&_pre]:rounded-lg
          [&_pre]:shadow-md
          [&_pre]:overflow-x-auto
          [&_pre]:min-h-[3rem]
          ${isDarkMode 
            ? '[&_pre]:bg-gray-800 [&_pre_code]:text-gray-100' 
            : '[&_pre]:bg-gray-100 [&_pre_code]:text-gray-800'}
          
          /* Code Block Content */
          [&_pre_code]:block
          [&_pre_code]:w-full
          [&_pre_code]:font-mono
          [&_pre_code]:text-sm
          [&_pre_code]:leading-relaxed
          [&_pre_code]:whitespace-pre-wrap
          
          /* Inline Code */
          [&_:not(pre)_code]:px-2
          [&_:not(pre)_code]:py-1
          [&_:not(pre)_code]:mx-1
          [&_:not(pre)_code]:rounded
          [&_:not(pre)_code]:font-mono
          [&_:not(pre)_code]:text-sm
          [&_:not(pre)_code]:break-words
          ${isDarkMode 
            ? '[&_:not(pre)_code]:bg-gray-800 [&_:not(pre)_code]:text-gray-100' 
            : '[&_:not(pre)_code]:bg-gray-100 [&_:not(pre)_code]:text-gray-800'}
        `}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className={`
                  px-3 py-1 rounded-full text-sm
                  ${isDarkMode ? 
                    'bg-gray-700 text-gray-100 hover:bg-gray-600' : 
                    'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                  transition-colors duration-200
                `}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPostContent;