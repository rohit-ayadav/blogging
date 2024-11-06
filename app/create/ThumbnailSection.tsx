
// ThumbnailSection.tsx
interface ThumbnailSectionProps {
    thumbnail: string | null;
    setThumbnail: (thumbnail: string) => void;
}

export const ThumbnailSection = ({ thumbnail, setThumbnail }: ThumbnailSectionProps) => {
    return (
        <>
            <div className="mb-5">
                <label htmlFor="thumbnail" className="text-lg font-bold">Thumbnail Image:</label>
                <input
                    type="text"
                    id="thumbnail"
                    placeholder="Enter the thumbnail image link"
                    className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
                    onChange={(e) => setThumbnail(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                    Optional: You can also add image in the content below
                </p>
            </div>
            {thumbnail && (
                <div className="mb-5">
                    <p className="text-lg font-bold">Thumbnail Preview:</p>
                    <img src={thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded" />
                </div>
            )}
        </>
    );
};
