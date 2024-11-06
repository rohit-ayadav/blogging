// Code to generate title based on content
import { Toaster, toast } from 'react-hot-toast';

interface TitleSectionProps {
    title: string;
    setTitle: (title: string) => void;
    content: string;
}

export const TitleSection = ({ title, setTitle, content }: TitleSectionProps) => {
    const generateTitle = async () => {
        if (content.length < 50) {
            toast.error('Content should be at least 50 characters long to generate title');
            return;
        }

        toast.promise(getTitle(content), {
            loading: 'Generating Title...',
            success: 'Title generated successfully',
            error: 'Failed to generate title',
        }).then(newTitle => {
            if (newTitle) {
                setTitle(newTitle);
            }
        }).catch(error => {
            console.error('Error generating title:', error);
        });
    };

    const getTitle = async (content: string) => {
        const response = await fetch("/api/generateTitle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();
        if (response.ok) return data.title;
        throw new Error(data.error);
    };

    return (
        <div className="mb-5">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <label htmlFor="title" className="text-lg font-bold">Blog Title:</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the blog title"
                className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
            />
            <p className="text-sm text-gray-500">
                Do you want to generate title based on content?
                <button type="button" onClick={generateTitle} className="text-blue-500 ml-1">
                    Click here
                </button>
            </p>
            {title.length > 200 && (
                <p className="text-red-500 text-sm">Count Character: {title.length}/250</p>
            )}
        </div>
    );
};
