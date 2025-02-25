import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { updateBlog } from '@/action/updateBlog';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { EditBlogState } from '@/types/blogs-types';

const useEditBlog = (state: EditBlogState, setState: React.Dispatch<React.SetStateAction<EditBlogState>>) => {
    const { data: session, status } = useSession();
    const router = useRouter();
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

    const validateForm = (state: EditBlogState) => {
        if (!state.title) return 'Title is required';
        if (!state.htmlContent && !state.markdownContent) return 'Content is required';
        if (!state.category) return 'Category is required';
        if (state.tags.length < 1) return 'At least one tag is required';
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm(state);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        // Check authorization
        // if (session && session?.user?.email !== state.createdBy) {
        //     if(session?.user?.role !== 'admin') {
        //     toast.error('You are not authorized to edit this blog post');
        //     return;
        // }

        updateState({ isLoading: true });

        const blogPostData = {
            title: sanitizeContent.title(state.title),
            content: sanitizeContent.content(
                state.editorMode === 'markdown' ? state.markdownContent : state.htmlContent
            ),
            thumbnail: state.thumbnail,
            thumbnailCredit: state.thumbnailCredit,
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
        router.push(`/blogs/${state.slug}`);

    };
    return {
        handleSave,
        updateState,
    };
};
export default useEditBlog;
