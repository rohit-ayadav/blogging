import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { MediaWrapper } from './MediaWrapper';
import { CodeBlock } from '../../app/component/CodeBlock';
import { useTheme } from '@/context/ThemeContext';
import { createRoot } from 'react-dom/client';
import { ReadingProgress } from './ReadingProgress';
import { Copy, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlogPostType } from '@/types/blogs-types';

interface BlogPostContentProps {
  post: BlogPostType;
}

const BlogPostContent = ({ post }: BlogPostContentProps) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    toggleDarkMode();
    toggleDarkMode();
  }, []);


  useEffect(() => {
    const processContent = async () => {
      let processedContent = post.content;

      if (post.language === 'markdown') {
        const result = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeStringify)
          .process(post.content);
        processedContent = result.toString();
      }

      DOMPurify.setConfig({
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['target', 'rel', 'style', 'class', 'allowfullscreen', 'frameborder', 'src'],
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
          'blockquote', 'code', 'pre', 'img', 'video', 'table', 'thead', 'tbody',
          'tr', 'td', 'th', 'strong', 'em', 'br', 'div', 'span', 'iframe', 'hr', 'figure', 'figcaption',
          'details', 'summary', 'cite', 'sub', 'sup', 'del', 'ins', 'mark', 'small', 's', 'u', 'abbr', 'time',
          'input', 'label', 'select', 'option', 'button', 'textarea', 'form', 'fieldset', 'legend', 'img'
        ]
      });

      DOMPurify.addHook('afterSanitizeElements', (node) => {
        if (node.tagName === 'A') {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener noreferrer');
          node.classList.add('inline-link', 'break-words');
        }
        if (node.tagName === 'BLOCKQUOTE') {
          node.classList.add('blockquote');
        }
        if (node.tagName === 'CODE' && node.parentElement?.tagName !== 'PRE') {
          node.classList.add('inline-code');
        }
        if (node.tagName === 'PRE') {
          node.classList.add('code-block');
        }
        if (node.tagName === 'TABLE') {
          node.classList.add('table');
        }
        if (node.tagName === 'IMG') {
          node.classList.add('w-full', 'object-cover', 'rounded-lg', 'shadow-lg');
        }
        return node;
      });

      setSanitizedContent(DOMPurify.sanitize(processedContent));
    };

    processContent();
  }, [post.content, post.language]);

  useEffect(() => {
    if (!contentRef.current) return;

    const container = contentRef.current;

    container.querySelectorAll('img').forEach((img) => {
      const wrapper = document.createElement('div');
      const root = createRoot(wrapper);
      root.render(
        <MediaWrapper
          src={img.getAttribute('src') || ''}
          alt={img.getAttribute('alt') || ''}
          type="image"
        // className="w-full object-cover rounded-lg shadow-lg"
        />
      );
      img.parentNode?.replaceChild(wrapper, img);
    });

    // Enhanced table processing with better scrolling
    container.querySelectorAll('table').forEach((table) => {
      const wrapper = document.createElement('div');
      const root = createRoot(wrapper);
      root.render(
        <div className="relative w-full my-6">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronRight className="w-6 h-6 text-gray-400 animate-pulse" />
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  {table.innerHTML}
                </table>
              </div>
            </div>
          </div>
        </div>
      );
      table.parentNode?.replaceChild(wrapper, table);
    });

    container.querySelectorAll('pre code').forEach((code) => {
      const wrapper = document.createElement('div');
      const root = createRoot(wrapper);
      const language = code.className.replace('language-', 'markdown-').replace('lang-', 'text-');
      const codeContent = code.textContent || '';

      root.render(
        <div className="relative group my-6">
          <CodeBlock
            code={codeContent.trim()}
            language={language}
            isDarkMode={isDarkMode}
          />
        </div>
      );
      code.parentElement?.parentNode?.replaceChild(wrapper, code.parentElement);
    });
  }, [sanitizedContent, isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ReadingProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <article className="flex-1 min-w-0">
          <div
            ref={contentRef}
            className={cn(
              "prose max-w-none",
              isMobile ? "prose-sm" : "prose-base lg:prose-lg",

              // Headings
              "prose-headings:scroll-mt-20",
              "prose-h1:text-3xl prose-h1:md:text-4xl",
              "prose-h2:text-2xl prose-h2:md:text-3xl",
              "prose-h3:text-xl prose-h3:md:text-2xl",
              "prose-h4:text-lg prose-h4:md:text-xl",
              "prose-headings:text-gray-900 dark:prose-headings:text-white",
              "prose-headings:font-bold prose-headings:tracking-tight",

              // Paragraphs and text
              "prose-p:text-base md:prose-p:text-lg",
              "prose-p:leading-relaxed",
              "prose-p:text-gray-700 dark:prose-p:text-gray-300",

              // Links
              "prose-a:text-blue-600 dark:prose-a:text-blue-400",
              "prose-a:no-underline hover:prose-a:underline",
              "prose-a:font-medium",

              // Lists
              "prose-ul:list-disc prose-ol:list-decimal",
              "prose-li:text-gray-700 dark:prose-li:text-gray-300",
              "prose-li:mb-1",

              // Blockquotes
              "prose-blockquote:border-l-4 prose-blockquote:border-blue-500",
              "prose-blockquote:pl-4 prose-blockquote:italic",
              "prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300",
              "prose-blockquote:mb-3",

              // Code
              // "prose-code:before:content-[''] prose-code:after:content-['']", // remove quotes before and after code blocks
              // "prose-code:bg-gray-100 dark:prose-code:bg-gray-800", // code block background color
              // "prose-code:rounded prose-code:px-1.5 prose-code:py-0.5", // code block padding
              // "prose-code:text-sm md:prose-code:text-base", // code block font size

              // Tables
              "prose-table:w-full",
              "prose-th:bg-gray-50 dark:prose-th:bg-gray-800",
              "prose-th:p-2 md:prose-th:p-3",
              "prose-th:text-sm md:prose-th:text-base",
              "prose-th:font-semibold",
              "prose-th:text-gray-900 dark:prose-th:text-white",
              "prose-td:p-2 md:prose-td:p-3",
              "prose-td:text-sm md:prose-td:text-base",
              "prose-td:text-gray-700 dark:prose-td:text-gray-300",

              // Dark mode
              isDarkMode ? "prose-invert" : "",

              // Additional utilities
              "selection:bg-blue-600/20 dark:selection:bg-blue-400/20"
            )}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogPostContent;