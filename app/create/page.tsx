"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '@/types/blogs-types';
import { TitleSection } from '@/app/create/component/TitleSection';
import { ThumbnailSection } from '@/app/create/component/ThumbnailSection';
import { EditorSection } from '@/app/create/component/EditorSection';
import { TagsSection } from '@/app/create/component/TagsSection';
import { CategorySection } from '@/app/create/component/CategorySection';
import { ActionButtons } from '@/app/create/component/ActionButtons';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { set } from 'lodash';

// Types
interface BlogState {
    isInitializing: boolean;
    isLoading: boolean;
    error: string | null;
    title: string;
    thumbnail: string | null;
    htmlContent: string;
    markdownContent: string;
    slug: string;
    tags: string[];
    category: string;
    blogId: string;
    tagAutoGen: boolean;
    editorMode: 'markdown' | 'visual' | 'html';
}

interface DraftData {
    title: string;
    thumbnail: string | null;
    markdownContent: string;
    htmlContent: string;
    slug: string;
    tags: string[];
    category: string;
    timestamp: number;
    editorMode: BlogState['editorMode'];
}

// Constants
const DEFAULT_CONTENT = {
    markdown: `# Welcome to the blog post editor\nStart writing your blog post here...`,
    html: `<h1>Welcome to the blog post editor</h1><br><br><p>Start writing your blog post here...</p>`
} as const;

const DRAFT_EXPIRY = 86400000; // 24 hours in milliseconds
const DRAFT_STORAGE_KEY = 'blogDraft';
const DRAFT_SAVE_DELAY = 1000; // 1 second
const DRAFT_SUCCESS_DURATION = 1000;
const DRAFT_INFO_DELAY = 3000;
const DRAFT_INFO_DURATION = 1500;

// Custom hooks
const useBlogDraft = (initialState: BlogState) => {
    const [state, setState] = React.useState<BlogState>(initialState);
    const [loading, setLoading] = React.useState(false);

    const updateState = React.useCallback((updates: Partial<BlogState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const loadDraft = React.useCallback(() => {
        try {
            const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (!draftData) return;

            const data: DraftData = JSON.parse(draftData);
            if (Date.now() - data.timestamp >= DRAFT_EXPIRY) {
                localStorage.removeItem(DRAFT_STORAGE_KEY);
                return;
            }

            updateState({
                title: data.title || '',
                thumbnail: data.thumbnail || null,
                markdownContent: data.markdownContent || DEFAULT_CONTENT.markdown,
                htmlContent: data.htmlContent || DEFAULT_CONTENT.html,
                tags: data.tags || [],
                slug: data.slug || '',
                category: data.category || '',
                editorMode: data.editorMode || 'markdown'
            });
        } catch (error) {
            console.error('Error loading draft:', error);
            updateState({ error: 'Error loading draft' });
        } finally {
            updateState({ isInitializing: false });
        }
    }, [updateState]);

    const saveDraft = React.useCallback(() => {
        if (state.isInitializing) return;

        const draftData: DraftData = {
            title: state.title,
            thumbnail: state.thumbnail,
            markdownContent: state.markdownContent,
            htmlContent: state.htmlContent,
            tags: state.tags,
            slug: state.slug,
            category: state.category,
            timestamp: Date.now(),
            editorMode: state.editorMode
        };

        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    }, [state]);

    return { state, updateState, loadDraft, saveDraft };
};

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
    const { data: session } = useSession();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = React.useState(false);

    const initialState: BlogState = {
        isInitializing: true,
        isLoading: false,
        error: null,
        title: '',
        thumbnail: null,
        htmlContent: DEFAULT_CONTENT.html,
        markdownContent: DEFAULT_CONTENT.markdown,
        slug: '',
        tags: [],
        category: '',
        blogId: '',
        tagAutoGen: false,
        editorMode: 'markdown'
    };

    const { state, updateState, loadDraft, saveDraft } = useBlogDraft(initialState);

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

            updateState({ blogId: data.blogPostId });
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            toast.success('Blog post created successfully');
            router.push(`/blogs/${data.blogPostId}`);
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
        <ScrollArea className={cn(
            "h-[calc(100vh-4rem)] px-4",
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
                />
            </div>
        </ScrollArea>
    );
}

// Component extraction for better organization
const LoadingSpinner = ({ isDarkMode }: { isDarkMode: boolean }) => (
    <div className="text-center space-y-4">
        <Loader2 className={cn(
            "h-8 w-8 animate-spin mx-auto",
            isDarkMode ? "text-gray-300" : "text-primary"
        )} />
        <p className={cn(
            "text-lg",
            isDarkMode ? "text-gray-300" : "text-muted-foreground"
        )}>Loading editor...</p>
    </div>
);

const PageHeader = ({ isDarkMode, error }: { isDarkMode: boolean; error: string | null }) => (
    <div className="flex items-center justify-between">
        <h1 className={cn(
            "text-3xl font-bold tracking-tight",
            isDarkMode ? "text-white" : "text-gray-900"
        )}>Create Blog Post</h1>
        {error && (
            <Alert variant="destructive" className={cn(
                "mt-4",
                isDarkMode && "bg-red-900 border-red-800"
            )}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
    </div>
);

const EditorCard = ({
    state,
    updateState,
    handleSave,
    handleSubmit,
    isDarkMode
}: {
    state: BlogState;
    updateState: (updates: Partial<BlogState>) => void;
    handleSave: () => void;
    handleSubmit: () => void;
    isDarkMode: boolean;
}) => (
    <Card className={cn(isDarkMode && "bg-gray-800 border-gray-700")}>
        <CardContent className={cn(
            "space-y-6 pt-6",
            isDarkMode && "text-gray-100"
        )}>
            <TitleSection
                title={state.title}
                setTitle={(title) => updateState({ title })}
                content={state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent}
                isDarkMode={isDarkMode}
            />

            <ThumbnailSection
                thumbnail={state.thumbnail}
                setThumbnail={(thumbnail) => updateState({ thumbnail })}
                isDarkMode={isDarkMode}
            />

            <EditorSection
                content={state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent}
                editorMode={state.editorMode}
                setEditorMode={(editorMode) => updateState({ editorMode })}
                handleContentChange={(content) => updateState({
                    [state.editorMode === 'markdown' ? 'markdownContent' : 'htmlContent']: content
                })}
                isDarkMode={isDarkMode}
            />

            <div className="border-t border-gray-200" />

            <TagsSection
                tags={state.tags}
                setTags={(tags) => updateState({ tags })}
                content={state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent}
                tagAutoGen={state.tagAutoGen}
                setTagAutoGen={(tagAutoGen) => updateState({ tagAutoGen })}
                isDarkMode={isDarkMode}
            />

            <CategorySection
                category={state.category}
                setCategory={(category) => updateState({ category })}
                categories={CATEGORIES}
                isDarkMode={isDarkMode}
            />

            <ActionButtons
                loading={state.isLoading}
                handleSave={handleSave}
                handleSubmit={handleSubmit}
                isDarkMode={isDarkMode}
                mode="create"
            />
        </CardContent>
    </Card>
);