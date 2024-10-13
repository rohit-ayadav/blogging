"use client";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormEvent, MouseEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading...</p> });
import 'react-quill/dist/quill.snow.css';
import { sanitize } from 'dompurify';

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const [blogId, setBlogId] = useState('');
    const [saveStatus, setSaveStatus] = useState('');

    const handleContentChange = (value: string) => {
        setContent(value);
        setWordCount(countWords(value));
        setCharCount(value.length);
    };

    const countWords = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const checkTitle = (title: string) => {
        if (title.length > 250) {
            throw new Error('Title should not exceed 250 characters');
        }
        return sanitize(title);
    }

    const checkTags = (tag: string) => {
        if (tag.length > 50) {
            throw new Error('Tag should not exceed 50 characters');
        }
        return sanitize(tag);
    }

    const createBlogPost = async (isDraft: boolean) => {
        if (!title) {
            throw new Error('Title is required');
        }

        if (!content) {
            throw new Error('Content is required');
        }
        const checkedTitle = checkTitle(title);
        const checkedTags = tags.map(tag => checkTags(tag));
        const blogPostData = {
            title: checkedTitle,
            content,
            thumbnail: thumbnail || null,
            tags: checkedTags,
            status: isDraft ? 'draft' : 'published',
        };

        try {
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogPostData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            console.log(data);
            setBlogId(data.blogPostId);
            toast.success(`${blogId}`);
            const successMessage = data.message || 'Blog post created successfully';
            console.log(successMessage);
            return successMessage;
        } catch (error: any) {
            throw new Error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>, isDraft: boolean) => {
        e.preventDefault();
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

            window.location.href = `/blogs/${blogId}`;
            console.log(message);
        } catch (error) {
            console.error('Submission Error:', error);
        }
    };

    const handleSave = () => {
        toast.promise(createBlogPost(true), {
            pending: 'Saving Draft...',
            success: 'Draft saved successfully',
            error: 'Failed to save draft',
        });
    };

    const modules = {
        toolbar: {
            container: '#toolbar',
        },
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        },
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'color', 'background', 'align', 'script', 'code-block'
    ];

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

            <form onSubmit={(e) => handleSubmit(e, false)}>
                <div className="mb-5">
                    <label htmlFor="title" className="text-lg font-bold">Blog Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the blog title"
                        className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
                    />
                </div>
                {title.length > 200 && (
                    <p className="text-red-500 text-sm">Count Character: {title.length}/250</p>
                )}

                <div className="mb-5">
                    <label htmlFor="thumbnail" className="text-lg font-bold">Thumbnail Image:</label>
                    <input
                        type="text"
                        id="thumbnail"
                        placeholder="Enter the thumbnail image link"
                        className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
                        onChange={(e) => setThumbnail(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">You can use any image link from the web</p>
                    <p className="text-sm text-gray-500">Optional: You can also add image in the content below</p>
                </div>

                <div className="mb-5">
                    <label className="text-lg font-bold">Content:</label>
                    <CustomToolbar />
                    <ReactQuill
                        value={content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        className="h-72 bg-white"
                    />
                    <p className="mt-2 mr-6 text-right text-gray-600">Words: {wordCount} | Characters: {charCount}</p>
                </div>

                <div className="mb-5">
                    <label htmlFor="tags" className="text-lg font-bold">Tags:</label>
                    <input
                        type="text"
                        id="tags"
                        placeholder="Enter tags separated by commas and hashes"
                        className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
                        onChange={(e) => setTags(
                            e.target.value
                                .split(/[,#\n]/)
                                .map(tag => tag.trim())
                                .filter(tag => tag)
                        )}
                    />
                </div>
                {tags.length > 0 && (
                    <div className="mb-5">
                        <label className="text-lg font-bold">Tags Preview:</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-20">
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-yellow-500 text-white rounded cursor-pointer"
                    >
                        <Save size={16} />
                        <span>Save Draft</span>
                    </Button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                    >
                        Publish
                    </button>
                </div>
            </form>
            {saveStatus && (
                <Alert>
                    <AlertDescription>{saveStatus}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}

const CustomToolbar = () => (
    <div id="toolbar">
        <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
            <option value="">Normal</option>
        </select>
        <select className="ql-font" defaultValue="sans-serif">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>

        </select>
        <select className="ql-size" defaultValue="medium">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>

        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <select className="ql-color" />
        <select className="ql-background" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-blockquote" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <select className="ql-align" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <button className="ql-clean" />
        <button className="ql-undo" />
        <button className="ql-redo" />
        <button className="ql-history" />
        <button className="ql-remove" />
    </div>
);
