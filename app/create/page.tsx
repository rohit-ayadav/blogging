"use client";
// CreateBlog.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';


export default function CreateBlog() {
    const route = useRouter();
    const { data: session } = useSession();
    const { isDarkMode } = useTheme();

    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [htmlContent, setHtmlContent] = useState(
        `<h1>Welcome to the blog post editor</h1>
        <p>Start writing your blog post here...</p>`
    );
    const [markdownContent, setMarkdownContent] = useState(
        `# Welcome to the blog post editor
        Start writing your blog post here...`
    );
    const [tags, setTags] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [blogId, setBlogId] = useState('');
    const [tagAutoGen, setTagAutoGen] = useState(false);
    const [editorMode, setEditorMode] = useState<'markdown' | 'visual' | 'html'>('markdown');

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
    }

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
            return data.message || 'Blog post created successfully';
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    const handleSave = async (isDraft: boolean) => {
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
                route.push(`/blog/${blogId}`);
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
        }
    }

    const handleContentChange = (value: string) => {
        if (editorMode === 'markdown') {
            setMarkdownContent(value);
        } else {
            setHtmlContent(value);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-5">
            <ToastContainer />
            {loading &&
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg text-center">
                        <p className="text-lg font-semibold">Creating Blog Post...</p>
                    </div>
                </div>
            }
            <h1 className="text-2xl mb-5">Create a New Blog Post</h1>

            <TitleSection title={title} setTitle={setTitle} content={(editorMode === 'markdown' ? markdownContent : htmlContent)} />
            <ThumbnailSection thumbnail={thumbnail} setThumbnail={setThumbnail} />
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
            <CategorySection category={category} setCategory={setCategory} categories={CATEGORIES} />
            <ActionButtons
                loading={loading}
                handleSave={() => handleSave(true)}
                handleSubmit={() => handleSave(false)}
            />
        </div>
    );
}
