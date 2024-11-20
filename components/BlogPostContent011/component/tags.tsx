// Separate component for tags

const Tags: React.FC<{ tags: string[]; isDarkMode: boolean }> = ({ tags, isDarkMode }) => {
    if (!tags?.length) return null;

    return (
        <div className="mt-8">
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Tags
            </h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className={`
                px-3 py-1 rounded-full text-sm
                ${isDarkMode
                                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                transition-colors duration-200
              `}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Tags;