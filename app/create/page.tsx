"use client";
// CreateBlog.tsx
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

    useEffect(() => {
        const draftTitle = localStorage.getItem('draftTitle');
        const draftThumbnail = localStorage.getItem('draftThumbnail');
        const draftMarkdownContent = localStorage.getItem('draftMarkdownContent');
        const draftHtmlContent = localStorage.getItem('draftHtmlContent');
        const draftTags = JSON.parse(localStorage.getItem('draftTags') || '[]');
        const draftCategory = localStorage.getItem('draftCategory');

        if (draftTitle) setTitle(draftTitle);
        if (draftThumbnail) setThumbnail(draftThumbnail);
        if (draftMarkdownContent) setMarkdownContent(draftMarkdownContent);
        if (draftHtmlContent) setHtmlContent(draftHtmlContent);
        if (draftTags.length > 0) setTags(draftTags);
        if (draftCategory) setCategory(draftCategory);
        console.log('draftTags:', draftTags);

    }, []);

    useEffect(() => {
        localStorage.setItem('draftTitle', title);
        localStorage.setItem('draftThumbnail', thumbnail || '');
        localStorage.setItem('draftMarkdownContent', markdownContent);
        localStorage.setItem('draftHtmlContent', htmlContent);
        localStorage.setItem('draftTags', JSON.stringify(tags));
        localStorage.setItem('draftCategory', category);

        console.log('tags:', tags);

    }, [title, thumbnail, markdownContent, htmlContent, tags, category]);


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
            console.log('Blog post created:', data);
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
                route.push(`/blogs/${blogId}`);
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
            <Toaster
                position='top-right'
                reverseOrder={false}
                gutter={8}
                // toastOptions={{
                //     duration: 5000,
                //     style: {
                //         background: isDarkMode ? '#333' : '#fff',
                //         color: isDarkMode ? '#fff' : '#333',
                //         fontSize: '1.2rem',
                //     },
                // }}
            />

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
