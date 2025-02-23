"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Calendar, Filter, SortDesc } from "lucide-react";

type SearchFiltersProps = {
    currentFilters: {
        type?: string;
        category?: string;
        tag?: string;
        from?: string;
        to?: string;
        language?: string;
        sort?: string;
    };
    suggestions: {
        categories: Array<{ _id: string; count: number }>;
        tags: Array<{ _id: string; count: number }>;
    };
};

function Filters({ currentFilters, suggestions }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const updateFilters = (newFilters: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden"
                >
                    <Filter size={20} />
                </button>
            </div>

            <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Content Type */}
                <div>
                    <h3 className="font-medium mb-2">Content Type</h3>
                    <select
                        value={currentFilters.type || 'all'}
                        onChange={(e) => updateFilters({ type: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="all">All Content</option>
                        <option value="blogs">Blogs</option>
                        <option value="users">Users</option>
                    </select>
                </div>

                {/* Sort Options */}
                <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                        <SortDesc size={16} />
                        Sort By
                    </h3>
                    <select
                        value={currentFilters.sort || 'recent'}
                        onChange={(e) => updateFilters({ sort: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="liked">Most Liked</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                {/* Date Range */}
                <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Calendar size={16} />
                        Date Range
                    </h3>
                    <div className="space-y-2">
                        <input
                            type="date"
                            value={currentFilters.from || ''}
                            onChange={(e) => updateFilters({ from: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="From"
                        />
                        <input
                            type="date"
                            value={currentFilters.to || ''}
                            onChange={(e) => updateFilters({ to: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="To"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                        {suggestions.categories.map((category) => (
                            <label
                                key={category._id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    value={category._id}
                                    checked={currentFilters.category === category._id}
                                    onChange={(e) => updateFilters({ category: e.target.value })}
                                />
                                {category._id} ({category.count})
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="font-medium mb-2">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.tags.map((tag) => (
                            <button
                                key={tag._id}
                                onClick={() => updateFilters({ tag: tag._id })}
                                className={`px-3 py-1 rounded-full text-sm ${currentFilters.tag === tag._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {tag._id} ({tag.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        ['type', 'category', 'tag', 'from', 'to', 'sort'].forEach(key => {
                            params.delete(key);
                        });
                        router.push(`/search?${params.toString()}`);
                    }}
                    className="w-full py-2 text-red-500 hover:text-red-600"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
}

export default function SearchFilters({ currentFilters, suggestions }: SearchFiltersProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Filters currentFilters={currentFilters} suggestions={suggestions} />
        </Suspense>
    );
}