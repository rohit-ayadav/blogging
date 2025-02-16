import React, { useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-quill/dist/quill.snow.css';
import 'react-markdown-editor-lite/lib/index.css';
import CustomToolbar from './CustomToolbar';

// Dynamic import for ReactQuill with SSR handling
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <EditorLoadingSkeleton />
});

interface EditorSectionProps {
    content: string;
    editorMode: 'markdown' | 'visual' | 'html';
    setEditorMode: (mode: 'markdown' | 'visual' | 'html') => void;
    handleContentChange: (value: string) => void;
    isDarkMode: boolean;
}

const EditorLoadingSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
            <Skeleton
                key={i}
                className={cn(
                    "w-full",
                    i % 2 === 0 ? "h-64" : "h-8"
                )}
            />
        ))}
    </div>
);

const EditorHeader = () => (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Content Editor
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose your preferred editing mode below
        </p>
    </div>
);

const EditorFooter = ({ wordCount, charCount }: { wordCount: number; charCount: number }) => (
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
);

export const EditorSection = ({
    content,
    editorMode,
    setEditorMode,
    handleContentChange,
    isDarkMode
}: EditorSectionProps) => {
    const [isError, setIsError] = useState(false);

    // Quill editor configuration
    const editorConfig = useMemo(() => ({
        modules: {
            toolbar: {
                container: '#toolbar',
                handlers: {}
            },
            history: {
                delay: 1000,
                maxStack: 500,
                userOnly: true
            },
            clipboard: {
                matchVisual: false
            },
            keyboard: {
                bindings: {}
            }
        },
        formats: [
            'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
            'blockquote', 'list', 'bullet', 'indent', 'link', 'image',
            'color', 'background', 'align', 'code-block'
        ]
    }), []);

    // Content statistics
    const contentStats = useMemo(() => {
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        return {
            wordCount: words.length,
            charCount: content.length
        };
    }, [content]);

    // Markdown configuration
    const markdownConfig = {
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
    };

    return (
        <div className="relative">
            <div className={cn(
                "rounded-lg shadow-md transition-all",
                isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
                <EditorHeader />

                <div className="p-4">
                    <Tabs
                        defaultValue={editorMode}
                        onValueChange={(value) => setEditorMode(value as 'markdown' | 'visual' | 'html')}
                        className="w-full"
                    >
                        <TabsList className="grid grid-cols-3 mb-4">
                            {['markdown', 'visual', 'html'].map((mode) => (
                                <TabsTrigger
                                    key={mode}
                                    value={mode}
                                    className={cn(
                                        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                                        isDarkMode && "text-gray-300"
                                    )}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="relative min-h-[400px]">
                            <TabsContent value="markdown" className="mt-2">
                                <Suspense fallback={<EditorLoadingSkeleton />}>
                                    <div className={cn(
                                        "rounded-md border",
                                        isDarkMode ? "border-gray-700" : "border-gray-200"
                                    )}>
                                        <MarkdownEditor
                                            style={{ height: '400px' }}
                                            value={content}
                                            renderHTML={(text) => new MarkdownIt({
                                                html: true,
                                                linkify: true,
                                                typographer: true
                                            }).render(text)}
                                            onChange={({ text }) => handleContentChange(text)}
                                            config={markdownConfig}
                                            className={cn('editor-wrapper', isDarkMode && 'dark-mode')}
                                        />
                                    </div>
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="visual" className="mt-2">
                                <Suspense fallback={<EditorLoadingSkeleton />}>
                                    <div className={cn(
                                        "rounded-md border",
                                        isDarkMode ? "border-gray-700" : "border-gray-200"
                                    )}>
                                        <CustomToolbar />
                                        <ReactQuill
                                            value={content}
                                            onChange={handleContentChange}
                                            modules={editorConfig.modules}
                                            formats={editorConfig.formats}
                                            className={cn("editor-container", isDarkMode && "dark")}
                                            theme="snow"
                                            placeholder="Start writing your content..."
                                        />
                                    </div>
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="html" className="mt-2">
                                <div className={cn(
                                    "rounded-md border",
                                    isDarkMode ? "border-gray-700" : "border-gray-200"
                                )}>
                                    <textarea
                                        value={content}
                                        onChange={(e) => handleContentChange(e.target.value)}
                                        className={cn(
                                            "w-full h-[400px] p-4 resize-none focus:ring-2 focus:ring-primary focus:outline-none rounded-md",
                                            isDarkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"
                                        )}
                                        placeholder="Enter your HTML content here..."
                                    />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    <EditorFooter {...contentStats} />
                </div>
            </div>

            {isError && (
                <Alert variant="destructive" className={cn(
                    "mt-4",
                    isDarkMode && "bg-red-900 border-red-800"
                )}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        There was an error with the editor. Please try refreshing the page.
                    </AlertDescription>
                </Alert>
            )}

            <style jsx global>{`
                .editor-wrapper {
                    min-height: 400px;
                    border-radius: 0.375rem;
                    overflow: hidden;
                }

                .editor-container {
                    height: 400px;
                }

                /* Dark mode styles */
                .dark-mode .rc-md-editor,
                .dark-mode .rc-md-navigation {
                    background-color: rgb(31, 41, 55);
                    color: rgb(209, 213, 219);
                    border-color: rgb(55, 65, 81);
                }

                .dark-mode .rc-md-editor textarea {
                    background-color: rgb(31, 41, 55);
                    color: rgb(209, 213, 219);
                }

                .dark .ql-toolbar,
                .dark .ql-container {
                    border-color: rgb(55, 65, 81) !important;
                    background-color: rgb(31, 41, 55);
                }

                .dark .ql-editor {
                    color: rgb(209, 213, 219);
                }

                .dark .ql-toolbar button,
                .dark .ql-toolbar .ql-picker {
                    color: rgb(209, 213, 219) !important;
                }

                .dark .ql-toolbar .ql-stroke {
                    stroke: rgb(209, 213, 219) !important;
                }

                .dark .ql-toolbar .ql-fill {
                    fill: rgb(209, 213, 219) !important;
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