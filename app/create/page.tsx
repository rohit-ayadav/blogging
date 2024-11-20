"use client";
import React, { useState, useEffect } from 'react';
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

interface DraftData {
    title: string;
    thumbnail: string | null;
    markdownContent: string;
    htmlContent: string;
    slug: string;
    tags: string[];
    category: string;
    timestamp: number;
    editorMode: 'markdown' | 'visual' | 'html';
}

const DEFAULT_CONTENT = {
    markdown: `# Welcome to the blog post editor\nStart writing your blog post here...`,
    html: `<h1>Welcome to the blog post editor</h1><br><br><p>Start writing your blog post here...</p>`
};

const DRAFT_EXPIRY = 86400000; // 24 hours in milliseconds

export default function CreateBlog() {
    const router = useRouter();
    const { data: session } = useSession();
    const { isDarkMode } = useTheme();

    const [state, setState] = useState({
        isInitializing: true,
        isLoading: false,
        error: null as string | null,
        title: '',
        thumbnail: null as string | null,
        htmlContent: DEFAULT_CONTENT.html,
        markdownContent: DEFAULT_CONTENT.markdown,
        slug: '',
        tags: [] as string[],
        category: '',
        blogId: '',
        tagAutoGen: false,
        editorMode: 'markdown' as 'markdown' | 'visual' | 'html'
    });

    const updateState = (updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    // Load draft data
    useEffect(() => {
        const loadDraft = () => {
            try {
                const draftData = localStorage.getItem('blogDraft');
                if (draftData) {
                    const data: DraftData = JSON.parse(draftData);
                    console.log('Draft data:', data);
                    if (Date.now() - data.timestamp < DRAFT_EXPIRY) {
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
                    } else {
                        localStorage.removeItem('blogDraft');
                    }
                }
            } catch (error) {
                console.error('Error loading draft:', error);
                updateState({ error: 'Error loading draft' });
            } finally {
                updateState({ isInitializing: false });
            }
        };

        setTimeout(loadDraft, 100);
    }, []);

    // Save draft data
    useEffect(() => {
        if (state.isInitializing) return;

        const saveDraft = () => {
            try {
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

                localStorage.setItem('blogDraft', JSON.stringify(draftData));
            } catch (error) {
                console.error('Error saving draft:', error);
            }
        };

        // if data is not same as initial content, save draft
        if (state.markdownContent !== DEFAULT_CONTENT.markdown || state.htmlContent !== DEFAULT_CONTENT.html) {
            const timeoutId = setTimeout(saveDraft, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [state]);

    const sanitizeContent = {
        title: (title: string) => DOMPurify.sanitize(title.slice(0, 250)),
        tags: (tag: string) => DOMPurify.sanitize(tag),
        slug: (slug: string) => DOMPurify.sanitize(slug),
        content: (value: string) => {
            if (state.editorMode === 'markdown') {
                const md = new MarkdownIt({ html: true });
                return DOMPurify.sanitize(md.render(value));
            }
            return DOMPurify.sanitize(value);
        }
    };

    const validateForm = () => {
        if (!state.title) return 'Title is required';
        if (!state.htmlContent && !state.markdownContent) return 'Content is required';
        if (!state.category) return 'Category is required';
        if (state.tags.length < 1) return 'At least one tag is required';
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        updateState({ isLoading: true });

        try {
            const blogPostData = {
                title: sanitizeContent.title(state.title),
                content: sanitizeContent.content(
                    state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent
                ),
                thumbnail: state.thumbnail,
                slug: sanitizeContent.slug(state.slug),
                tags: state.tags.map(sanitizeContent.tags),
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

            localStorage.removeItem('blogDraft');
            toast.success('Blog post created successfully');
            router.push(`/blogs/${data.blogPostId}`);


        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            updateState({ isLoading: false });
        }
    };

    const handleSaveDraft = () => {
        toast.success('Draft saved successfully', {
            icon: '📝',
            duration: 1000,
        });

        setTimeout(() => {
            toast.success('Drafts are saved locally and will be available for 24 hours', {
                icon: '🕒',
                duration: 1500,
            });
        }, 3000);
    };

    if (state.isInitializing) {
        return (
            <div className={cn(
                "flex items-center justify-center min-h-[60vh]",
                isDarkMode ? "bg-gray-900" : "bg-white"
            )}>
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
            </div>
        );
    }

    return (
        <ScrollArea className={cn(
            "h-[calc(100vh-4rem)] px-4",
            isDarkMode ? "bg-gray-900" : "bg-white"
        )}>
            <div className="max-w-3xl mx-auto py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className={cn(
                        "text-3xl font-bold tracking-tight",
                        isDarkMode ? "text-white" : "text-gray-900"
                    )}>Create Blog Post</h1>
                    {state.error && (
                        <Alert variant="destructive" className={cn(
                            "mt-4",
                            isDarkMode && "bg-red-900 border-red-800"
                        )}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <Card className={cn(
                    isDarkMode && "bg-gray-800 border-gray-700"
                )}>
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

                        {/* <SlugSection
                            slug={state.slug}
                            setSlug={(slug: string) => updateState({ slug })}
                            isDarkMode={isDarkMode}
                        /> */}

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
                            handleSave={() => handleSaveDraft()}
                            handleSubmit={() => handleSave()}
                            isDarkMode={isDarkMode}
                            mode="create"
                        />
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}