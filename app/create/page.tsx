"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '../component/BlogPostCard';
import { TitleSection } from './TitleSection';
import { ThumbnailSection } from './ThumbnailSection';
import { EditorSection } from './EditorSection';
import { TagsSection } from './TagsSection';
import { CategorySection } from './CategorySection';
import { ActionButtons } from './ActionButtons';
import { Toaster } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

// Define interfaces for better type safety
interface DraftData {
    title: string;
    thumbnail: string | null;
    markdownContent: string;
    htmlContent: string;
    tags: string[];
    category: string;
    timestamp: number;
    editorMode: 'markdown' | 'visual' | 'html';
}

const DEFAULT_CONTENT = {
    markdown: `# Welcome to the blog post editor\nStart writing your blog post here...`,
    html: `<h1>Welcome to the blog post editor</h1><p>Start writing your blog post here...</p>`
};

export default function CreateBlog() {
    const route = useRouter();
    const { data: session } = useSession();
    const { isDarkMode } = useTheme();

    // Initial loading state
    const [isInitializing, setIsInitializing] = useState(true);

    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [htmlContent, setHtmlContent] = useState(DEFAULT_CONTENT.html);
    const [markdownContent, setMarkdownContent] = useState(DEFAULT_CONTENT.markdown);
    const [tags, setTags] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [blogId, setBlogId] = useState('');
    const [tagAutoGen, setTagAutoGen] = useState(false);
    const [editorMode, setEditorMode] = useState<'markdown' | 'visual' | 'html'>('markdown');

    // Load draft data
    useEffect(() => {
        const loadDraft = () => {
            try {
                const draftData = localStorage.getItem('blogDraft');
                if (draftData) {
                    const data: DraftData = JSON.parse(draftData);

                    // Check if draft is still valid (less than 24 hours old)
                    if (Date.now() - data.timestamp < 86400000) {
                        setTitle(data.title || '');
                        setThumbnail(data.thumbnail || null);
                        setMarkdownContent(data.markdownContent || DEFAULT_CONTENT.markdown);
                        setHtmlContent(data.htmlContent || DEFAULT_CONTENT.html);
                        setTags(data.tags || []);
                        setCategory(data.category || '');
                        setEditorMode(data.editorMode || 'markdown');

                        // Notify user about recovered draft
                        toast.info('Recovered your previous draft', {
                            position: 'top-right',
                            autoClose: 3000
                        });
                    } else {
                        // Clear expired draft
                        localStorage.removeItem('blogDraft');
                    }
                }
            } catch (error) {
                console.error('Error loading draft:', error);
                toast.error('Error loading draft. Starting with empty editor.');
            } finally {
                setIsInitializing(false);
            }
        };

        // Delay draft loading slightly to ensure smooth component mounting
        const timeoutId = setTimeout(loadDraft, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    // Save draft data
    useEffect(() => {
        // Don't save while initializing
        if (isInitializing) return;

        const saveDraft = () => {
            try {
                const draftData: DraftData = {
                    title,
                    thumbnail,
                    markdownContent,
                    htmlContent,
                    tags,
                    category,
                    timestamp: Date.now(),
                    editorMode
                };

                localStorage.setItem('blogDraft', JSON.stringify(draftData));
                console.log('Draft saved:', draftData);
            } catch (error) {
                console.error('Error saving draft:', error);
            }
        };

        // Debounce draft saving to prevent excessive writes
        const timeoutId = setTimeout(saveDraft, 1000);
        return () => clearTimeout(timeoutId);
    }, [title, thumbnail, markdownContent, htmlContent, tags, category, editorMode, isInitializing]);

    // Clear draft on successful publish
    const clearDraft = () => {
        try {
            localStorage.removeItem('blogDraft');
        } catch (error) {
            console.error('Error clearing draft:', error);
        }
    };

    const checkTitle = (title: string) => {
        if (title.length > 250) {
            return DOMPurify.sanitize(title.slice(0, 250));
        }
        return DOMPurify.sanitize(title);
    };

    const checkTags = (tag: string) => {
        return DOMPurify.sanitize(tag);
    };

    const checkContent = (value: string) => {
        if (editorMode === 'markdown') {
            const md = new MarkdownIt({ html: true });
            const content = md.render(value);
            return DOMPurify.sanitize(content);
        }
        return DOMPurify.sanitize(value);
    };

    const createBlogPost = async (isDraft: boolean) => {
        if (!title) {
            toast.error('Title is required');
            return;
        }
        if (!htmlContent || !markdownContent) {
            toast.error('Content is required');
            return;
        }
        if (!category) {
            toast.error('Category is required');
            return;
        }
        if (tags.length < 1) {
            toast.error('At least one tag is required');
            return;
        }

        const checkedTitle = checkTitle(title);
        const checkedTags = tags.map(tag => checkTags(tag));

        const blogPostData = {
            title: checkedTitle,
            content: checkContent(editorMode === 'markdown' ? markdownContent : htmlContent),
            thumbnail,
            tags: checkedTags,
            category,
            status: isDraft ? 'draft' : 'published',
            language: editorMode === 'markdown' ? 'markdown' : 'html',
        };

        try {
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogPostData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            setBlogId(data.blogPostId);

            // Clear draft on successful publish
            if (!isDraft) {
                clearDraft();
            }

            return data.message || 'Blog post created successfully';
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    };

    const handleSave = async (isDraft: boolean) => {
        setLoading(true);
        try {
            const message = await toast.promise(createBlogPost(isDraft), {
                pending: 'Creating Blog Post...',
                success: 'Blog post created successfully',
                error: {
                    render({ data }) {
                        return <div>{(data as Error).message}</div>;
                    },
                },
            });
            if (message === 'Blog post created successfully') {
                route.push(`/blogs/${blogId}`);
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = (value: string) => {
        if (editorMode === 'markdown') {
            setMarkdownContent(value);
        } else {
            setHtmlContent(value);
        }
    };

    if (isInitializing) {
        return (
            <div className="max-w-2xl mx-auto p-5 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg">Loading editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-5">
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
            />
            <ToastContainer />

            <h1 className="text-2xl mb-5">Create a New Blog Post</h1>

            <TitleSection
                title={title}
                setTitle={setTitle}
                content={(editorMode === 'markdown' ? markdownContent : htmlContent)}
            />
            <ThumbnailSection
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
            />
            <EditorSection
                content={(editorMode === 'markdown' ? markdownContent : htmlContent)}
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                handleContentChange={handleContentChange}
            />
            <TagsSection
                tags={tags}
                setTags={setTags}
                content={(editorMode === 'markdown' ? markdownContent : htmlContent)}
                tagAutoGen={tagAutoGen}
                setTagAutoGen={setTagAutoGen}
            />
            <CategorySection
                category={category}
                setCategory={setCategory}
                categories={CATEGORIES}
            />
            <ActionButtons
                loading={loading}
                handleSave={() => handleSave(true)}
                handleSubmit={() => handleSave(false)}
            />
        </div>
    );
}