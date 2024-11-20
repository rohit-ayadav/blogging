"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { TitleSection } from '@/app/create/component/TitleSection';
import { ThumbnailSection } from '@/app/create/component/ThumbnailSection';
import { EditorSection } from '@/app/create/component/EditorSection';
import { TagsSection } from '@/app/create/component/TagsSection';
import { CategorySection } from '@/app/create/component/CategorySection';
import { ActionButtons } from '@/app/create/component/ActionButtons';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import TurndownService from 'turndown';
import { CATEGORIES } from '@/types/blogs-types';

const DEFAULT_CONTENT = {
    markdown: `# Welcome to the blog post editor\nStart writing your blog post here...`,
    html: `<h1>Welcome to the blog post editor</h1><br><br><p>Start writing your blog post here...</p>`
};

export default function EditBlog() {
    const router = useRouter();
    const { data: session } = useSession();
    const { isDarkMode } = useTheme();
    const { id } = useParams();

    const [state, setState] = useState({
        isInitializing: true,
        isLoading: false,
        error: null as string | null,
        title: '',
        thumbnail: null as string | null,
        htmlContent: DEFAULT_CONTENT.html,
        markdownContent: DEFAULT_CONTENT.markdown,
        tags: [] as string[],
        category: '',
        blogId: '',
        createdBy: '',
        tagAutoGen: false,
        editorMode: 'markdown' as 'markdown' | 'visual' | 'html'
    });

    const updateState = (updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        const fetchBlogPost = async () => {
            if (!id) {
                router.push('/blogs');
                return;
            }

            try {
                const response = await fetch(`/api/blog/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog post');
                }
                const data1 = await response.json();

                const data = data1.data;

                if (data.language === 'markdown') {
                    const html = data.content;
                    const turndownService = new TurndownService();
                    const markdown = turndownService.turndown(html);
                    data.content = markdown;
                }
                // authorised user check
                if (session?.user?.email !== data.createdBy) {
                    toast.error('You are not authorized to edit this blog post');
                    router.push(`/unauthorized`);
                }

                updateState({
                    title: data.title || '',
                    thumbnail: data.thumbnail || null,
                    markdownContent: data.language === 'markdown' ? data.content : DEFAULT_CONTENT.markdown,
                    htmlContent: data.language === 'html' ? data.content : DEFAULT_CONTENT.html,
                    tags: data.tags || [],
                    category: data.category || '',
                    blogId: id as string,
                    createdBy: data.createdBy,
                    editorMode: data.language === 'markdown' ? 'markdown' : 'html',
                    isInitializing: false
                });

            } catch (error) {
                console.error('Error fetching blog post:', error);
                updateState({
                    error: 'Failed to load blog post',
                    isInitializing: false
                });
            }
        };

        fetchBlogPost();
    }, [id, router]);

    const sanitizeContent = {
        title: (title: string) => DOMPurify.sanitize(title.slice(0, 250)),
        tags: (tag: string) => DOMPurify.sanitize(tag),
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

    const handleSave = async (isDraft: boolean) => {
        const validationError = validateForm();
        if (validationError && !isDraft) {
            toast.error(validationError);
            return;
        }

        // Check authorization
        if (session?.user?.email !== state.createdBy) {
            toast.error('You are not authorized to edit this blog post');
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
                tags: state.tags.map(sanitizeContent.tags),
                category: state.category,
                status: isDraft ? 'draft' : 'published',
                language: state.editorMode === 'markdown' ? 'markdown' : 'html',
            };

            const response = await fetch(`/api/blog/${state.blogId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogPostData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update blog post');

            if (!isDraft) {
                toast.success('Blog post updated successfully');
                router.push(`/blogs/${state.blogId}`);
            } else {
                toast.success('Draft saved successfully');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            updateState({ isLoading: false });
        }
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
                    )}>
                        Edit Blog Post
                    </h1>

                </div>
                <div className="flex items-center justify-between">
                    {state.error && (
                        <Alert variant="destructive" className={cn(
                            "mt-4",
                            isDarkMode && "bg-red-900 border-red-800"
                        )}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{state.error}</AlertDescription>
                            <button
                                onClick={() => window.location.reload()}
                                className={cn(
                                    "ml-auto text-sm font-medium underline",
                                    isDarkMode ? "text-gray-300" : "text-primary"
                                )}
                            >
                                Refresh
                            </button>
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
                            handleSubmit={() => handleSave(false)}
                            isDarkMode={isDarkMode}
                            mode="edit"
                        />
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}