"use client";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormEvent, MouseEvent, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading...</p> });
import 'react-quill/dist/quill.snow.css';
import { sanitize } from 'dompurify';
import { useParams, useRouter } from 'next/navigation';

export default function EditBlog() {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const [blogId, setBlogId] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const router = useRouter();

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchBlogPost(id as string);
        } else {
            router.push('/blogs');
        }
    }, [id]);

    const fetchBlogPost = async (id: string) => {
        try {
            const response = await fetch(`/api/blog/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blog post');
            }
            const data = await response.json();
            setTitle(data.title);
            setContent(data.content);
            setThumbnail(data.thumbnail);
            setTags(data.tags);
            setBlogId(id);
            setCreatedBy(data.createdBy);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blog post:', error);
            toast.error('Failed to load blog post');
            setLoading(false);
        }
    };

    const checkTitle = (title: string) => {
        if (title?.length > 250) {
            throw new Error('Title should not exceed 250 characters');
        }
        return sanitize(title);
    }

    const checkTags = (tag: string) => {
        if (tag?.length > 50) {
            throw new Error('Tag should not exceed 50 characters');
        }
        return sanitize(tag);
    }

    const updateBlogPost = async (isDraft: boolean) => {
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
        const email = session?.user?.email;
        if (email !== createdBy) {
            throw new Error('You are not authorized to edit this blog post');
        }

        try {
            const response = await fetch(`/api/blog/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogPostData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data.message || 'Blog post updated successfully';
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>, isDraft: boolean) => {
        e.preventDefault();
        setLoading(true);
        try {
            const message = await toast.promise(updateBlogPost(isDraft), {
                pending: 'Updating Blog Post...',
                success: 'Blog post updated successfully',
                error: {
                    render({ data }) {
                        return <div>{(data as Error).message}</div>;
                    },
                },
            });
            setSaveStatus(message);
            router.push(`/blogs/${blogId}`);
        } catch (error) {
            console.error('Submission Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        toast.promise(updateBlogPost(true), {
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

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-5">
            <ToastContainer />
            <h1 className="text-2xl mb-5">Edit Blog Post</h1>
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
                {title?.length > 200 && (
                    <p className="text-red-500 text-sm">Count Character: {title?.length}/250</p>
                )}

                <div className="mb-5">
                    <label htmlFor="thumbnail" className="text-lg font-bold">Thumbnail Image:</label>
                    <input
                        type="text"
                        id="thumbnail"
                        value={thumbnail || ''}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="Enter the thumbnail image link"
                        className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
                    />
                    <p className="text-sm text-gray-500">You can use any image link from the web</p>
                </div>
                {thumbnail && (
                    <div className="mb-5">
                        <p className="text-lg font-bold">Thumbnail Preview:</p>
                        <img src={thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded" />
                    </div>
                )}

                <div className="mb-5">
                    <label className="text-lg font-bold">Content:</label>
                    <CustomToolbar />
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        className='bg-white p-5 mt-1 rounded border border-gray-300'
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="tags" className="text-lg font-bold">Tags:</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags?.join(', ')}
                        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                        placeholder="Enter tags separated by commas"
                        className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
                    />
                </div>
                {tags?.length > 0 && (
                    <div className="mb-5">
                        <label className="text-lg font-bold">Tags Preview:</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                                        {tag}
                                    </span>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                    >
                                        &times;
                                    </button>
                                </div>
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
                        Update
                    </button>
                </div>
            </form>
            {saveStatus && <p className="mt-4 text-green-500">{saveStatus}</p>}
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
