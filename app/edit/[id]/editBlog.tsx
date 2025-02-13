"use client";
import React, { useEffect, useState } from 'react';
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CATEGORIES, EditBlogState } from '@/types/blogs-types';
import LoadingSpinner from '@/app/create/component/LoadingSpinner';
import UrlSection from '@/app/create/component/CustomURL';
import { updateBlog } from '@/action/updateBlog';

export default function EditBlogComponent(BlogData: EditBlogState) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { isDarkMode } = useTheme();
    const [state, setState] = useState({ ...BlogData });

    const updateState = (updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

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

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        // Check authorization
        if (session && session?.user?.email !== state.createdBy) {
            toast.error('You are not authorized to edit this blog post');
            return;
        }

        updateState({ isLoading: true });

        const blogPostData = {
            title: sanitizeContent.title(state.title),
            content: sanitizeContent.content(
                state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent
            ),
            thumbnail: state.thumbnail,
            tags: state.tags.map(sanitizeContent.tags),
            category: state.category,
            status: 'published',
            language: state.editorMode === 'markdown' ? 'markdown' : 'html',
            id: state.blogId,
            slug: state.slug,
        };

        const response = await updateBlog(blogPostData);

        if (response.error) {
            updateState({ isLoading: false });
            toast.error(response.error);
            return;
        }
        updateState({ isLoading: false });
        toast.success(`${response.message}`);
        router.push(`/blogs/${state.blogId}`);

    };

    if (state.isInitializing) {
        return (
            <LoadingSpinner isDarkMode={isDarkMode} />
        );
    }

    if (status === 'loading') return null;

    return (

        <div className={cn(
            "min-h-screen",
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
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
                        <div className="border-t border-gray-200 dark:border-gray-700 my-6 sm:my-8" />
                        <UrlSection
                            customUrl={state.slug}
                            setCustomUrl={(slug: string) => updateState({ slug })}
                            title={state.title}
                        />

                        <TagsSection
                            tags={state.tags}
                            setTags={(tags) => updateState({ tags })}
                            content={state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent}
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
                            handleSubmit={() => handleSave()}
                            isDarkMode={isDarkMode}
                            mode="edit"
                            clearDraft={() => router.back()}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}