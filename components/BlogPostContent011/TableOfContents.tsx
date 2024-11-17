// TableOfContents.tsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export const TableOfContents = ({ items }: { items: TOCItem[] }) => {
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

export default TableOfContents;
export type { TOCItem };