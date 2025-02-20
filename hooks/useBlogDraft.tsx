import { BlogState } from "@/types/blogs-types";
import React from "react";


interface DraftData {
    title: string;
    thumbnail: string | null;
    thumbnailCredit: string | null;
    markdownContent: string;
    htmlContent: string;
    slug: string;
    tags: string[];
    category: string;
    timestamp: number;
    editorMode: BlogState['editorMode'];
}

const DEFAULT_CONTENT = {
    markdown: ``,
    html: ``
} as const;

const DRAFT_EXPIRY = 86400000; // 24 hours in milliseconds
const DRAFT_STORAGE_KEY = 'blogDraft';

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
                thumbnailCredit: data.thumbnailCredit || null,
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
            thumbnailCredit: state.thumbnailCredit,
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


export default useBlogDraft;