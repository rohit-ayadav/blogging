import React, { useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import CustomToolbar from '@/app/create/CustomToolbar';
import { useTheme } from 'next-themes';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import 'react-quill/dist/quill.snow.css';
import 'react-markdown-editor-lite/lib/index.css';

// Dynamic imports with loading fallbacks
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <EditorLoadingSkeleton />
});

interface EditorSectionProps {
    content: string;
    editorMode: 'markdown' | 'visual' | 'html';
    setEditorMode: (mode: 'markdown' | 'visual' | 'html') => void;
    handleContentChange: (value: string) => void;
    isDarkMode?: boolean;
}

const EditorLoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />

    </div>
);

export const EditorSection = ({
    content,
    editorMode,
    setEditorMode,
    handleContentChange
}: EditorSectionProps) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isError, setIsError] = useState(false);

    // Enhanced Quill modules with better mobile support
    const modules = useMemo(() => ({
        toolbar: {
            container: '#toolbar',
            handlers: {
                // Add custom handlers here
            }
        },
        history: {
            delay: 1000,
            maxStack: 500,
            userOnly: true
        },
        clipboard: {
            matchVisual: false // Prevents weird paste behavior on mobile
        },
        keyboard: {
            bindings: {
                // Add custom keyboard shortcuts here

            }
        }
    }), []);

    const formats = [
        'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
        'blockquote', 'list', 'bullet', 'indent', 'link', 'image',
        'color', 'background', 'align', 'code-block'
    ];

    // Word and character count with memoization
    const { wordCount, charCount } = useMemo(() => {
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        return {
            wordCount: words.length,
            charCount: content.length
        };
    }, [content]);

    return (
        <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all">
                {/* Header Section */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Content Editor
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose your preferred editing mode below
                    </p>
                </div>

                {/* Editor Section */}
                <div className="p-4">
                    <Tabs
                        defaultValue={editorMode}
                        onValueChange={(value) => setEditorMode(value as 'markdown' | 'visual' | 'html')}
                        className="w-full"
                    >
                        <TabsList className="grid grid-cols-3 mb-4">
                            <TabsTrigger
                                value="markdown"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Markdown
                            </TabsTrigger>
                            <TabsTrigger
                                value="visual"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Visual
                            </TabsTrigger>
                            <TabsTrigger
                                value="html"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                HTML
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative min-h-[400px]">
                            <TabsContent value="markdown" className="mt-2">
                                <Suspense fallback={<EditorLoadingSkeleton />}>
                                    <div className="rounded-md border border-gray-200 dark:border-gray-700">
                                        <MarkdownEditor
                                            style={{ height: '400px' }}
                                            value={content}
                                            renderHTML={(text) => new MarkdownIt({
                                                html: true,
                                                linkify: true,
                                                typographer: true
                                            }).render(text)}
                                            onChange={({ text }) => handleContentChange(text)}
                                            config={{
                                                view: {
                                                    menu: true,
                                                    md: true,
                                                    html: false,
                                                },
                                                canView: {
                                                    menu: true,
                                                    md: true,
                                                    html: false,
                                                    fullScreen: true,
                                                    hideMenu: true,
                                                }
                                            }}
                                            className={`${isDarkMode ? 'dark-mode' : ''} editor-wrapper`}
                                        />
                                    </div>
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="visual" className="mt-2">
                                <Suspense fallback={<EditorLoadingSkeleton />}>
                                    <div className="rounded-md border border-gray-200 dark:border-gray-700">
                                        <CustomToolbar />
                                        <ReactQuill
                                            value={content}
                                            onChange={(value) => handleContentChange(value)}
                                            modules={modules}
                                            formats={formats}
                                            className="editor-container"
                                            theme="snow"
                                            placeholder="Start writing your content..."
                                        />
                                    </div>
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="html" className="mt-2">
                                <div className="rounded-md border border-gray-200 dark:border-gray-700">
                                    <textarea
                                        value={content}
                                        onChange={(e) => handleContentChange(e.target.value)}
                                        className="w-full h-[400px] p-4 resize-none focus:ring-2 focus:ring-primary 
                                                 focus:outline-none rounded-md bg-white dark:bg-gray-700 
                                                 text-gray-900 dark:text-gray-100"
                                        placeholder="Enter your HTML content here..."
                                    />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Footer Section */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center 
                                  px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                                <span className="font-medium mr-1">Words:</span> {wordCount}
                            </span>
                            <span className="flex items-center">
                                <span className="font-medium mr-1">Characters:</span> {charCount}
                            </span>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <span className="text-xs text-gray-400">
                                Last saved: {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        There was an error with the editor. Please try refreshing the page.
                    </AlertDescription>
                </Alert>
            )}

            {/* Add custom styles for better mobile support */}
            <style jsx global>{`
                .editor-wrapper {
                    min-height: 400px;
                    border-radius: 0.375rem;
                    overflow: hidden;
                }

                .editor-container {
                    height: 400px;
                }

                /* Mobile optimizations */
                @media (max-width: 640px) {
                    .editor-wrapper,
                    .editor-container {
                        height: 300px;
                    }

                    .ql-toolbar {
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .ql-toolbar button {
                        padding: 4px !important;
                    }
                }

                /* Dark mode optimizations */
                .dark .editor-wrapper,
                .dark .ql-toolbar,
                .dark .ql-container {
                    border-color: rgb(55, 65, 81) !important;
                }

                .dark .ql-toolbar button,
                .dark .ql-toolbar .ql-picker {
                    color: rgb(209, 213, 219) !important;
                }

                .dark .ql-editor {
                    color: rgb(209, 213, 219);
                }

                /* Accessibility improvements */
                .ql-toolbar button:focus,
                .ql-toolbar .ql-picker:focus {
                    outline: 2px solid rgb(59, 130, 246);
                    outline-offset: 2px;
                }
            `}</style>
        </div>
    );
};
