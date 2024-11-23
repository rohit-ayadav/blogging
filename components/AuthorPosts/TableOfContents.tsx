import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { List, ChevronRight, BookOpen, Hash, ArrowUpCircle } from 'lucide-react';
import { TOCItem } from '@/types/blogs-types';

interface TableOfContentsProps {
    content: string;
    contentType?: 'html' | 'markdown';
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content, contentType = 'html' }) => {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(true);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const generateTOC = () => {
            const tempDiv = document.createElement('div');
            if (contentType === 'markdown') {
                const headingRegex = /^(#{1,6})\s+(.+)$/gm;
                const headings = [];
                let match;
                while ((match = headingRegex.exec(content)) !== null) {
                    const level = match[1].length; // Number of '#' characters
                    const text = match[2].trim(); // Heading text
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-'); // Generate ID from text
                    headings.push({ level, text, id }); // Add to TOC
                }
                setToc(headings);
            } else if (contentType === 'html') {
                tempDiv.innerHTML = content;
                const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
                const headings = Array.from(headingElements).map(heading => ({
                    level: parseInt(heading.tagName[1]), // Get the number from 'h1', 'h2', etc.
                    text: heading.textContent || '', // Get the text content of the heading
                    id: heading.id || ( // Get the ID of the heading or generate one
                        heading.textContent ? // If the heading has text content
                            heading.textContent // Use the text content
                                .toLowerCase() // Convert to lowercase
                                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
                                .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
                            : '') // Otherwise, use an empty string
                }));
                setToc(headings);
            }
        };
        generateTOC();
    }, [content, contentType]);

    useEffect(() => {
        const handleScroll = () => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const scrollPosition = window.scrollY;

            let currentHeading = '';
            for (const heading of headings) {
                const offsetTop = heading.getBoundingClientRect().top + scrollPosition;
                if (scrollPosition >= offsetTop - 150) {
                    currentHeading = heading.id;
                }
            }
            setActiveId(currentHeading);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderTOCItem = (item: TOCItem, index: number): JSX.Element => {
        const indentLevel = item.level - 1;
        const isActive = item.id === activeId;

        return (
            <li key={index} className={`my-1 transition-all duration-200 ease-in-out`}>
                <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setActiveId(item.id);
                        }
                    }}
                    className={`
                        group flex items-center py-1 px-2 rounded-md
                        ${indentLevel > 0 ? `ml-${indentLevel * 4}` : ''}
                        ${isActive
                            ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700'}`
                            : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                        }
                        transition-all duration-200
                    `}
                >
                    {indentLevel === 0 ? (
                        <Hash className="w-4 h-4 mr-2 opacity-60" />
                    ) : (
                        <ChevronRight className={`w-3 h-3 mr-2 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                    )}
                    <span className="text-sm">{item.text}</span>
                </a>
            </li>
        );
    };

    return (
        <nav className={`
            sticky top-4 p-4 rounded-lg transition-colors duration-200
            ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
        `}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Contents</h2>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-1 rounded-md transition-colors duration-200
                        ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
                    `}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>

            {isExpanded && (
                <>
                    {toc.length > 0 ? (
                        <ul className="space-y-1">
                            {toc.map((item, index) => renderTOCItem(item, index))}
                        </ul>
                    ) : (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No headings found
                        </p>
                    )}

                    <button
                        onClick={scrollToTop}
                        className={`
                            mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md
                            text-sm transition-colors duration-200
                            ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                        `}
                    >
                        <ArrowUpCircle className="w-4 h-4" />
                        Back to top
                    </button>
                </>
            )}
        </nav>
    );
};

export default TableOfContents;