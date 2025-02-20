import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TitleSection } from './TitleSection';
import ThumbnailSection from './ThumbnailSection';
import { EditorSection } from './EditorSection';
import { TagsSection } from './TagsSection';
import { CategorySection } from './CategorySection';
import { ActionButtons } from './ActionButtons';
import { CATEGORIES, BlogState } from '@/types/blogs-types';
import { UrlSection } from './CustomURL';

interface EditorCardProps {
    state: BlogState;
    updateState: (updates: Partial<BlogState>) => void;
    handleSave: () => void;
    handleSubmit: () => void;
    isDarkMode: boolean;
    clearForm: () => void;
}

const EditorCard: React.FC<EditorCardProps> = ({
    state,
    updateState,
    handleSave,
    handleSubmit,
    isDarkMode,
    clearForm
}) => {
    const getContent = () => state.editorMode === 'markdown'
        ? state.markdownContent
        : state.htmlContent;

    const handleContentUpdate = (content: string) => {
        const key = state.editorMode === 'markdown' ? 'markdownContent' : 'htmlContent';
        updateState({ [key]: content });
    };

    return (
        <Card className={cn(
            "transition-colors duration-200",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white",
            "max-w-5xl w-full mx-0 sm:mx-auto"
        )}>
            <CardContent className={cn(
                "space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8",
                isDarkMode ? "text-gray-100" : "text-gray-900"
            )}>
                <div className="space-y-6">
                    <TitleSection
                        title={state.title}
                        setTitle={(title) => updateState({ title })}
                        content={getContent()}
                        isDarkMode={isDarkMode}
                    />

                    <ThumbnailSection
                        thumbnail={state.thumbnail}
                        setThumbnail={(thumbnail) => updateState({ thumbnail })}
                        thumbnailCredit={state.thumbnailCredit}
                        setThumbnailCredit={(thumbnailCredit) => updateState({ thumbnailCredit })}
                        isDarkMode={isDarkMode}
                    />
                </div>

                <EditorSection
                    content={getContent()}
                    editorMode={state.editorMode}
                    setEditorMode={(editorMode) => updateState({ editorMode })}
                    handleContentChange={handleContentUpdate}
                    isDarkMode={isDarkMode}
                />

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 sm:my-8" />

                <div className="space-y-6">
                    <UrlSection
                        customUrl={state.slug}
                        setCustomUrl={(slug: string) => updateState({ slug })}
                        title={state.title}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TagsSection
                            tags={state.tags}
                            setTags={(tags) => updateState({ tags })}
                            content={getContent()}
                            isDarkMode={isDarkMode}
                        />

                        <CategorySection
                            category={state.category}
                            setCategory={(category) => updateState({ category })}
                            categories={CATEGORIES}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <ActionButtons
                        loading={state.isLoading}
                        handleSave={handleSave}
                        handleSubmit={handleSubmit}
                        isDarkMode={isDarkMode}
                        clearDraft={clearForm}
                        mode="create"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default EditorCard;