// EditorSection.tsx
import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import CustomToolbar from './CustomToolbar';
import { useTheme } from 'next-themes';
import 'react-quill/dist/quill.snow.css';
import 'react-markdown-editor-lite/lib/index.css';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-300"></div>
    </div>
});

interface EditorSectionProps {
    content: string;
    editorMode: 'markdown' | 'visual' | 'html'
    setEditorMode: (mode: 'markdown' | 'visual' | 'html') => void;
    handleContentChange: (value: string) => void;
}

export const EditorSection = ({
    content,
    editorMode,
    setEditorMode,
    handleContentChange
}: EditorSectionProps) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const modules = useMemo(() => ({
        toolbar: {
            container: '#toolbar',
        },
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        },
    }), []);

    const formats = [
        'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
        'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video',
        'color', 'background', 'align', 'script', 'code-block'
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <label className="text-lg font-bold dark:text-gray-300">Content:</label>
            </div>
            <Tabs
                defaultValue={editorMode}
                onValueChange={(value) => setEditorMode(value as 'markdown' | 'visual' | 'html')}
                className="border-b border-gray-300 dark:border-gray-600"
            >
                <TabsList>
                    <TabsTrigger value="markdown" className="px-4 py-2 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:active:bg-gray-700">Markdown Editor</TabsTrigger>
                    <TabsTrigger value="visual" className="px-4 py-2 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:active:bg-gray-700">Visual Editor</TabsTrigger>
                    <TabsTrigger value="html" className="px-4 py-2 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:active:bg-gray-700">Raw Html</TabsTrigger>
                </TabsList>
                <TabsContent value="markdown" className="pt-4">
                    <MarkdownEditor
                        style={{ height: '400px' }}
                        value={content}
                        renderHTML={(text) => new MarkdownIt().render(text)}
                        onChange={({ text }) => handleContentChange(text)}
                        config={{
                            view: {
                                menu: true,
                                md: true,
                                html: false,
                            },
                        }}
                        className={isDarkMode ? 'dark-mode' : ''}
                    />
                </TabsContent>
                <TabsContent value="visual" className="pt-4">
                    <CustomToolbar />
                    <ReactQuill
                        value={content}
                        onChange={(value) => handleContentChange(value)}
                        modules={modules}
                        formats={formats}
                        className={`bg-white dark:bg-gray-700 dark:text-gray-300 p-4 mt-4 rounded-lg border border-gray-300 dark:border-gray-600 w-full`}
                    />
                </TabsContent>
                <TabsContent value="html" className="pt-4">
                    <textarea
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className={`bg-white dark:bg-gray-700 dark:text-gray-300 p-4 mt-4 rounded-lg border border-gray-300 dark:border-gray-600 w-full`}
                    />
                </TabsContent>
            </Tabs>
            <div className="flex justify-between mt-4 text-gray-500 dark:text-gray-400">
                <p className="text-sm">
                    Word Count: {content.split(/\s+/).length}
                </p>
                <p className="text-sm">
                    Character Count: {content.length}
                </p>
            </div>
        </div>

    );
};