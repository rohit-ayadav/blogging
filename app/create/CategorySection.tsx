interface CategorySectionProps {
    category: string;
    setCategory: (category: string) => void;
    categories: Array<{ value: string; label: string; }>;
}

export const CategorySection = ({ category, setCategory, categories }: CategorySectionProps) => {
    return (
        <div className="mb-5">
            <label htmlFor="category" className="text-lg font-bold">Category:</label>
            <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 mt-1 text-lg rounded border border-gray-300"
            >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                    <option key={index} value={category.value}>
                        {category.label}
                    </option>
                ))}
            </select>
        </div>
    );
};