"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { cn } from "@/lib/utils";
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { BlogState } from '@/types/blogs-types';
import EditorCard from './component/EditorCard';
import PageHeader from './component/PageHeader';
import LoadingSpinner from './component/LoadingSpinner';
import useBlogDraft from '@/hooks/useBlogDraft';

// Constants
const DEFAULT_CONTENT = {
    markdown: ``,
    html: ``
} as const;

const DRAFT_EXPIRY = 86400000; // 24 hours in milliseconds
const DRAFT_STORAGE_KEY = 'blogDraft';
const DRAFT_SAVE_DELAY = 1000; // 1 second
const DRAFT_SUCCESS_DURATION = 1000;
const DRAFT_INFO_DELAY = 3000;
const DRAFT_INFO_DURATION = 1500;


// Utility functions
const sanitizer = {
    title: (title: string) => DOMPurify.sanitize(title.slice(0, 250)),
    tags: (tag: string) => DOMPurify.sanitize(tag),
    slug: (slug: string) => DOMPurify.sanitize(slug),
    content: (value: string, editorMode: BlogState['editorMode']) => {
        if (editorMode === 'markdown') {
            const md = new MarkdownIt({ html: true });
            return DOMPurify.sanitize(md.render(value));
        }
        return DOMPurify.sanitize(value);
    }
};

const validateBlogPost = (state: BlogState): string | null => {
    if (!state.title) return 'Title is required';
    if (!state.htmlContent && !state.markdownContent) return 'Content is required';
    if (!state.category) return 'Category is required';
    if (state.tags.length < 1) return 'At least one tag is required';
    return null;
};


// Main component
export default function CreateBlog() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = React.useState(false);

    const initialState: BlogState = {
        isInitializing: true,
        isLoading: false,
        error: null,
        title: '',
        thumbnail: null,
        thumbnailCredit: null,
        htmlContent: DEFAULT_CONTENT.html,
        markdownContent: DEFAULT_CONTENT.markdown,
        slug: '',
        tags: [],
        category: '',
        blogId: '',
        tagAutoGen: false,
        editorMode: 'visual'
    };

    const { state, updateState, loadDraft, saveDraft } = useBlogDraft(initialState);

    const clearForm = () => {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        updateState({
            title: '',
            thumbnail: null,
            thumbnailCredit: null,
            htmlContent: '',
            markdownContent: '',
            slug: '',
            tags: [],
            category: '',
            blogId: '',
            tagAutoGen: false,
            editorMode: 'visual'
        });
    };


    // Load draft on mount
    React.useEffect(() => {
        const timeoutId = setTimeout(loadDraft, 100);
        return () => clearTimeout(timeoutId);
    }, [loadDraft]);

    // Auto-save draft
    React.useEffect(() => {
        if (state.markdownContent === DEFAULT_CONTENT.markdown &&
            state.htmlContent === DEFAULT_CONTENT.html) return;

        const timeoutId = setTimeout(saveDraft, DRAFT_SAVE_DELAY);
        return () => clearTimeout(timeoutId);
    }, [state, saveDraft]);

    const handleSave = async () => {
        const validationError = validateBlogPost(state);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        updateState({ isLoading: true });

        try {
            setLoading(true);
            const blogPostData = {
                title: sanitizer.title(state.title),
                content: sanitizer.content(
                    state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent,
                    state.editorMode
                ),
                thumbnail: state.thumbnail,
                thumbnailCredit: state.thumbnailCredit,
                slug: sanitizer.slug(state.slug),
                tags: state.tags.map(sanitizer.tags),
                category: state.category,
                status: 'published',
                language: state.editorMode === 'markdown' ? 'markdown' : 'html',
            };

            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogPostData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create blog post');

            updateState({ blogId: data.id });
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            toast.success('Blog post created successfully');
            clearForm();
            console.log('Blog post created:', JSON.stringify(data, null, 2));
            console.log('Blog post data:', data.data.id);
            router.push(`/blogs/${data.id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            updateState({ isLoading: false });
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        saveDraft();
        toast.success('Draft saved successfully', {
            icon: '📝',
            duration: DRAFT_SUCCESS_DURATION,
        });

        setTimeout(() => {
            toast.success('Drafts are saved locally and will be available for 24 hours', {
                icon: '🕒',
                duration: DRAFT_INFO_DURATION,
            });
        }, DRAFT_INFO_DELAY);
    };

    if (state.isInitializing) {
        return (
            <div className={cn(
                "flex items-center justify-center min-h-[60vh]",
                isDarkMode ? "bg-gray-900" : "bg-white"
            )}>
                <LoadingSpinner isDarkMode={isDarkMode} />
            </div>
        );
    }

    return (
        <div className={cn(
            "px-4",
            isDarkMode ? "bg-gray-900" : "bg-white"
        )}>
            <div className="max-w-3xl mx-auto py-8 space-y-6">
                <PageHeader
                    isDarkMode={isDarkMode}
                    error={state.error}
                />

                <EditorCard
                    state={state}
                    updateState={updateState}
                    handleSave={handleSaveDraft}
                    handleSubmit={handleSave}
                    isDarkMode={isDarkMode}
                    clearForm={clearForm}
                />
            </div>
        </div>
    );
}
