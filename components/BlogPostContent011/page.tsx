import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '@/context/ThemeContext';
import ReactDOM from 'react-dom';
import Tags from './tags';
import CopyButton from './copyBtn';

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

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const { isDarkMode } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);

  const sanitizeConfig = {
    ALLOWED_ATTR: ['class', 'style', 'id', 'href', 'target', 'rel'],
    ALLOWED_TAGS: [
      'p', 'code', 'pre', 'strong', 'em', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a',
      'img', 'span', 'br', 'div', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'sup', 'sub', 'details', 'summary'
    ]
  };

  useEffect(() => {
    if (!contentRef.current) return;

    const preElements = contentRef.current.getElementsByTagName('pre');

    Array.from(preElements).forEach((pre) => {
      // Ensure pre elements maintain their formatting
      pre.style.whiteSpace = 'pre';
      pre.style.overflowX = 'auto';

      if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper relative group';
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Add inner wrapper for proper scrolling
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'code-scroll-wrapper';
        scrollWrapper.style.overflow = 'auto';
        wrapper.insertBefore(scrollWrapper, pre);
        scrollWrapper.appendChild(pre);
      }

      const code = pre.querySelector('code');
      if (!code) return;

      // Ensure code elements maintain their formatting
      code.style.whiteSpace = 'pre';
      code.style.display = 'inline-block';
      code.style.minWidth = '100%';

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'copy-button-container';
      pre.parentElement?.parentElement?.insertBefore(buttonContainer, pre.parentElement);

      ReactDOM.render(
        <CopyButton isDarkMode={isDarkMode} code={code.textContent || ''} />,
        buttonContainer
      );
    });

    // Process links
    const links = contentRef.current.getElementsByTagName('a');
    Array.from(links).forEach(link => {
      if (!link.closest('pre')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Cleanup function
    return () => {
      if (contentRef.current) {
        const copyButtons = contentRef.current.querySelectorAll('.copy-button-container');
        copyButtons.forEach(button => {
          ReactDOM.unmountComponentAtNode(button);
          button.remove();
        });
      }
    };
  });


  const sanitizedContent = DOMPurify.sanitize(post.content, sanitizeConfig);

  const proseStyles = {
    base: `
      prose prose-lg max-w-3xl
      mx-auto
      ${isDarkMode ? 'prose-invert' : ''}
      px-2 sm:px-6
    `,
    typography: `
      prose-headings:scroll-mt-20
      prose-h1:text-2xl sm:prose-h1:text-4xl prose-h1:font-bold prose-h1:my-4 sm:prose-h1:my-6
      prose-h2:text-xl sm:prose-h2:text-3xl prose-h2:font-bold prose-h2:my-3 sm:prose-h2:my-5
      prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:font-semibold prose-h3:my-2 sm:prose-h3:my-4
      prose-p:text-base prose-p:leading-relaxed prose-p:my-2 sm:prose-p:my-4
      prose-hr:my-6 sm:prose-hr:my-8 prose-hr:border-gray-200 dark:prose-hr:border-gray-700
    `,
    lists: `
      prose-ul:my-2 sm:prose-ul:my-4 prose-ul:list-disc prose-ul:pl-4 sm:prose-ul:pl-6
      prose-ol:my-2 sm:prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-4 sm:prose-ol:pl-6
      prose-li:my-1 sm:prose-li:my-2 prose-li:pl-1 sm:prose-li:pl-2
      prose-li:marker:text-gray-500 dark:prose-li:marker:text-gray-400
    `,
    links: `
      prose-a:text-blue-600 dark:prose-a:text-blue-400
      prose-a:no-underline hover:prose-a:underline
      prose-a:font-normal
      prose-a:transition-colors prose-a:duration-200
    `,
    blockquotes: `
      prose-blockquote:border-l-4 
      prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700
      prose-blockquote:pl-3 sm:prose-blockquote:pl-4 
      prose-blockquote:italic
      prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
      prose-blockquote:my-4 sm:prose-blockquote:my-6
    `,
    tables: `
      prose-table:w-full prose-table:my-4 sm:prose-table:my-6
      prose-table:border prose-table:border-collapse
      [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full
      [&_table]:whitespace-nowrap sm:[&_table]:whitespace-normal
      prose-th:p-2 sm:prose-th:p-3 prose-td:p-2 sm:prose-td:p-3
      prose-th:border prose-td:border
      prose-th:bg-gray-50 dark:prose-th:bg-gray-800
      prose-th:text-left
      prose-td:border-gray-200 dark:prose-td:border-gray-700
      prose-th:border-gray-200 dark:prose-th:border-gray-700
      [&_th]:min-w-[8rem] [&_td]:min-w-[8rem]
    `,
    codeBlocks: `
      [&_.code-block-wrapper]:relative [&_.code-block-wrapper]:my-4 sm:[&_.code-block-wrapper]:my-6
      [&_.code-block-wrapper]:rounded-lg [&_.code-block-wrapper]:shadow-md
      [&_.code-block-wrapper]:overflow-hidden
      [&_pre]:overflow-x-auto [&_pre]:p-4 sm:[&_pre]:p-6
      [&_pre]:bg-gray-800 [&_pre]:min-w-full
      [&_pre_code]:text-gray-100 [&_pre_code]:inline-block [&_pre_code]:min-w-full
      [&_pre]:text-[14px] sm:[&_pre]:text-[15px] [&_pre]:leading-relaxed
      [&_.copy-button-container]:absolute [&_.copy-button-container]:right-2 [&_.copy-button-container]:top-2
    `,
    inlineCode: `
      [&_:not(pre)_code]:text-inherit
      [&_:not(pre)_code]:bg-transparent
      [&_:not(pre)_code]:font-normal
      [&_:not(pre)_code]:before:content-['']
      [&_:not(pre)_code]:after:content-['']
      [&_:not(pre)_code]:whitespace-normal
      [&_:not(pre)_code]:break-words
      [&_:not(pre)_code]:text-blue-300
    `,
    details: `
      prose-details:my-2 sm:prose-details:my-4
      prose-details:border
      prose-details:rounded-lg
      prose-details:p-3 sm:prose-details:p-4
      prose-details:border-gray-200 dark:prose-details:border-gray-700
      [&_summary]:cursor-pointer
      [&_summary]:font-semibold
    `,
    media: `
      prose-img:rounded-lg
      prose-img:my-4 sm:prose-img:my-6
      prose-img:mx-auto
      prose-img:shadow-md
    `,
    emphasis: `
      prose-strong:font-semibold
      prose-em:italic
      prose-del:line-through
      prose-del:text-gray-500
      prose-ins:underline
      prose-ins:decoration-green-500
      prose-sup:text-xs prose-sup:top-[-0.5em]
      prose-sub:text-xs prose-sub:bottom-[-0.25em]
    `
  };

  return (
    <article className="w-full max-w-[100rem] mx-auto">
      <div
        ref={contentRef}
        className={`
          ${proseStyles.base}
          ${proseStyles.typography}
          ${proseStyles.lists}
          ${proseStyles.links}
          ${proseStyles.blockquotes}
          ${proseStyles.tables}
          ${proseStyles.codeBlocks}
          ${proseStyles.inlineCode}
          ${proseStyles.details}
          ${proseStyles.media}
          ${proseStyles.emphasis}
        `}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      <div className="max-w-3xl mx-auto px-2 sm:px-6">
        <Tags tags={post.tags} isDarkMode={isDarkMode} />
      </div>
    </article>
  );
}