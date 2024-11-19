// components/BlogPostContent011/CodeBlock.tsx
import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';


interface CodeBlockProps {
    code: string;
    language: string;
    isDarkMode: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);
    const { isDarkMode, toggleDarkMode } = useTheme();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg overflow-hidden">
            <button
                onClick={handleCopy}
                className="absolute right-2 top-2 p-2 bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy code"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-white" />
                )}
            </button>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <SyntaxHighlighter
                    language={language || 'text'}
                    style={isDarkMode ? vscDarkPlus : vs}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                    }}
                    showLineNumbers={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};