import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { useTheme } from '@/context/ThemeContext';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHTML from 'remark-html';
import rehypeStringify from 'rehype-stringify';
import rehypeParse from 'rehype-parse';
import { BlogPostType } from '@/types/blogs-types';
import { Check, Copy, Share2, ChevronRight } from 'lucide-react';
import TableWrapper from './TableWrapper';

interface BlogPostContentProps {
  post: BlogPostType;
  language: string | null;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface CodeBlockProps {
  code: string;
  language?: string;
  isDarkMode: boolean;
}

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', calculateProgress);
    calculateProgress();

    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <div
        className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const ShareButton = ({ title, url }: { title: string; url: string }) => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 p-3 bg-blue-600 dark:bg-blue-500 
                 text-white rounded-full shadow-lg hover:bg-blue-700 
                 dark:hover:bg-blue-600 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={shared ? 'Shared!' : 'Share this article'}
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
};

const CodeBlock = ({ code, language, isDarkMode }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-block-wrapper relative group rounded-lg bg-gray-900 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        {language && (
          <span className="text-xs text-gray-400 font-mono">
            {language}
          </span>
        )}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 text-xs rounded-md
                   bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm sm:text-base">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};



const TableOfContents = ({ items }: { items: TOCItem[] }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="hidden lg:block sticky top-24 w-64 shrink-0 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left font-semibold mb-4"
        >
          <span>Table of Contents</span>
          <ChevronRight
            className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        </button>
        {isOpen && (
          <nav className="space-y-2">
            {items.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className={`
                  block text-sm hover:text-blue-600 dark:hover:text-blue-400
                  transition-colors duration-200
                  ${item.level === 1 ? 'font-medium' : ''}
                  ${item.level === 2 ? 'pl-4' : ''}
                  ${item.level === 3 ? 'pl-8' : ''}
                `}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default function BlogPostContent({ post, language = 'html' }: BlogPostContentProps) {
  const { isDarkMode } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    const processContent = async () => {
      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkHTML)
        .use(rehypeParse)
        .use(rehypeStringify)
        .process(post.content || '');
      setSanitizedContent(DOMPurify.sanitize(processedContent.toString()));
    };

    processContent();
  }, [post.content]);

  useEffect(() => {
    if (!contentRef.current) return;

    // Generate table of contents
    const headings = contentRef.current.querySelectorAll('h1, h2, h3');
    const items: TOCItem[] = Array.from(headings).map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));
    setTocItems(items);

    // Assign IDs to headings if they don't have them
    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      }
    });

    const processCodeBlocks = () => {
      const preElements = contentRef.current?.getElementsByTagName('pre');
      Array.from(preElements || []).forEach((pre) => {
        if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
          const code = pre.querySelector('code');
          const language = code?.className?.replace('language-', '') || '';

          const container = document.createElement('div');
          ReactDOM.render(
            <CodeBlock
              code={pre.textContent || ''}
              language={language}
              isDarkMode={isDarkMode}
            />,
            container
          );

          pre.parentNode?.replaceChild(container, pre);
        }
      });
    };

    const processImages = () => {
      const images = contentRef.current?.getElementsByTagName('img');
      Array.from(images || []).forEach(img => {
        if (!img.closest('figure')) {
          const figure = document.createElement('figure');
          figure.className = 'my-6 flex flex-col items-center';

          const wrapper = document.createElement('div');
          wrapper.className = 'relative w-full aspect-video max-w-3xl mx-auto';

          img.className = 'rounded-lg shadow-lg object-cover w-full h-full';
          img.setAttribute('loading', 'lazy');

          wrapper.appendChild(img);
          figure.appendChild(wrapper);
          img.parentNode?.insertBefore(figure, img);

          if (img.getAttribute('alt')) {
            const figcaption = document.createElement('figcaption');
            figcaption.className = 'text-sm text-gray-600 dark:text-gray-400 mt-2 text-center';
            figcaption.textContent = img.getAttribute('alt');
            figure.appendChild(figcaption);
          }
        }
      });
    };

    const processTables = () => {
      const tables = contentRef.current?.getElementsByTagName('table');
      Array.from(tables || []).forEach(table => {
        if (!table.parentElement?.classList.contains('table-wrapper')) {
          const container = document.createElement('div');
          ReactDOM.render(
            <TableWrapper>{table.outerHTML}</TableWrapper>,
            container
          );
          table.parentNode?.replaceChild(container, table);
        }
      });
    };

    processCodeBlocks();
    processImages();
    processTables();

    return () => {
      const containers = contentRef.current?.querySelectorAll('.code-block-wrapper, .table-wrapper');
      containers?.forEach(container => {
        ReactDOM.unmountComponentAtNode(container);
      });
    };
  }, [isDarkMode]);

  const styles = {
    container: `
        max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8
        flex flex-col lg:flex-row gap-8
      `,
    article: `
        flex-grow min-w-0
        mx-auto w-full 
        sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] 2xl:w-[75%]
      `,
    content: `
        prose prose-sm sm:prose-base lg:prose-lg
        max-w-none
        prose-headings:scroll-mt-20
        prose-headings:text-gray-900 dark:prose-headings:text-white
        
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-p:leading-relaxed
        
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-a:no-underline hover:prose-a:underline
        
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-strong:font-semibold
        
        prose-code:text-blue-600 dark:prose-code:text-blue-400
        prose-code:font-normal
        prose-code:before:content-none prose-code:after:content-none
        
        prose-pre:p-0 prose-pre:overflow-hidden
        prose-pre:bg-transparent
        
        prose-img:rounded-lg prose-img:shadow-md
        
        prose-table:w-full
        prose-table:border-collapse
        prose-table:overflow-hidden
        [&_table]:border-spacing-0
        
        [&_thead]:bg-gray-50 dark:[&_thead]:bg-gray-800
        [&_thead_tr]:border-b [&_thead_tr]:border-gray-200 dark:[&_thead_tr]:border-gray-700
        
        [&_th]:text-sm [&_th]:font-medium [&_th]:text-gray-900 dark:[&_th]:text-white
        [&_th]:p-3 sm:[&_th]:p-4
        [&_th]:text-left
        [&_th:first-child]:pl-4 sm:[&_th:first-child]:pl-6
        [&_th:last-child]:pr-4 sm:[&_th:last-child]:pr-6
        
        [&_tbody_tr]:border-b [&_tbody_tr]:border-gray-200 dark:[&_tbody_tr]:border-gray-700
        [&_tbody_tr:last-child]:border-0
        
        [&_td]:text-sm [&_td]:text-gray-700 dark:[&_td]:text-gray-300
        [&_td]:p-3 sm:[&_td]:p-4
        [&_td:first-child]:pl-4 sm:[&_td:first-child]:pl-6
        [&_td:last-child]:pr-4 sm:[&_td:last-child]:pr-6
        
        [&_figure]:my-4 sm:[&_figure]:my-6
        [&_figure]:mx-auto
        [&_figure_img]:max-w-full
        [&_figcaption]:text-center [&_figcaption]:mt-2
        [&_figcaption]:text-sm [&_figcaption]:text-gray-600 dark:[&_figcaption]:text-gray-400
      `,
    codeBlock: `
        [&_.code-block-wrapper]:my-4 sm:[&_.code-block-wrapper]:my-6
        [&_.code-block-wrapper]:rounded-lg
        [&_.code-block-wrapper]:border [&_.code-block-wrapper]:border-gray-200 dark:[&_.code-block-wrapper]:border-gray-700
        [&_.code-block-wrapper]:bg-gray-50 dark:[&_.code-block-wrapper]:bg-gray-800
      `
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 mx-0 px-0">
      <ReadingProgress />
      <div className={styles.container}>
        {/* <TableOfContents items={tocItems} /> */}
        <article className={styles.article}>
          <div
            ref={contentRef}
            className={`
                ${styles.content}
                ${styles.codeBlock}
                ${isDarkMode ? 'prose-invert' : ''}
              `}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>
      </div>
      <ShareButton
        title={post.title}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </div>
  );
}