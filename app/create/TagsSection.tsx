
import { Toaster, toast } from 'react-hot-toast';


// TagsSection.tsx
interface TagsSectionProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    content: string;
    tagAutoGen: boolean;
    setTagAutoGen: (value: boolean) => void;
}

export const TagsSection = ({
    tags,
    setTags,
    content,
    tagAutoGen,
    setTagAutoGen
}: TagsSectionProps) => {
    const generateTags = async () => {
        if (content.length < 50) {
            toast.error('Content should be at least 50 characters long to generate tags');
            return;
        }

        setTagAutoGen(true);
        toast.promise(generateTagsFromContent(content), {
            loading: 'Generating Tags...',
            success: 'Tags generated successfully',
            error: 'Failed to generate tags',
        }).then(newTags => {
            if (newTags) {
                setTags([...tags, ...newTags]);
            }
        }).catch(error => {
            setTagAutoGen(false);
            console.error('Error generating tags:', error);
        });
    };

    const generateTagsFromContent = async (content: string) => {
        const response = await fetch('/api/generateTags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();
        if (response.ok) return data.tags;
        throw new Error(data.error);
    };

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            {!tagAutoGen && (
                <div className="mb-5">
                    <label htmlFor="tags" className="text-lg font-bold">Tags:</label>
                    <p className="text-sm text-gray-500">
                        Want to generate tags automatically?
                        <button type="button" onClick={generateTags} className="text-blue-500 ml-1">
                            Click here
                        </button>
                    </p>
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
            )}
            {tags.length > 0 && (
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
        </>
    );
};