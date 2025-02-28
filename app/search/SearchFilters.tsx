"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Calendar, Filter, SortDesc, X, ChevronDown, ChevronUp } from "lucide-react";
import LoadingEffect from "@/lib/LoadingEffect";
import { useTheme } from "@/context/ThemeContext";

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
    const [expandedSections, setExpandedSections] = useState({
        contentType: true,
        sort: true,
        dateRange: true,
        categories: true,
        tags: true
    });
    const { isDarkMode } = useTheme();

    // Count active filters
    const activeFiltersCount = Object.values(currentFilters).filter(Boolean).length;

    const updateFilters = (newFilters: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        // Reset to page 1 when filters change
        params.delete("page");
        router.push(`/search?${params.toString()}`);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Close mobile filter panel when navigating
    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        ['type', 'category', 'tag', 'from', 'to', 'sort'].forEach(key => {
            params.delete(key);
        });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className={`rounded-lg shadow transition-colors ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}>
            {/* Filter Header */}
            <div className={`flex justify-between items-center p-4 border-b transition-colors ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${isDarkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                            }`}>
                            {activeFiltersCount}
                        </span>
                    )}
                </h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`lg:hidden p-2 rounded-full transition-colors ${isDarkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                    aria-label={isOpen ? "Close filters" : "Open filters"}
                >
                    {isOpen ? <X size={18} /> : <Filter size={18} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Filter Content */}
            <div className={`space-y-4 p-4 ${isOpen
                    ? 'fixed left-0 right-0 bottom-0 rounded-t-xl z-50 max-h-[80vh] overflow-y-auto lg:static lg:max-h-none lg:rounded-none lg:z-auto'
                    : 'hidden lg:block'
                } ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>

                {/* Content Type Section */}
                <div className={`border-b pb-4 transition-colors ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <button
                        onClick={() => toggleSection('contentType')}
                        className="w-full flex justify-between items-center mb-2 font-medium"
                    >
                        <span>Content Type</span>
                        {expandedSections.contentType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.contentType && (
                        <select
                            value={currentFilters.type || 'all'}
                            onChange={(e) => updateFilters({ type: e.target.value })}
                            className={`w-full p-2 border rounded transition-colors ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                        >
                            <option value="all">All Content</option>
                            <option value="blogs">Blogs</option>
                            <option value="users">Users</option>
                        </select>
                    )}
                </div>

                {/* Sort Options Section */}
                <div className={`border-b pb-4 transition-colors ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <button
                        onClick={() => toggleSection('sort')}
                        className="w-full flex justify-between items-center mb-2 font-medium"
                    >
                        <span className="flex items-center gap-2">
                            <SortDesc size={16} />
                            Sort By
                        </span>
                        {expandedSections.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.sort && (
                        <select
                            value={currentFilters.sort || 'recent'}
                            onChange={(e) => updateFilters({ sort: e.target.value })}
                            className={`w-full p-2 border rounded transition-colors ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                        >
                            <option value="recent">Most Recent</option>
                            <option value="popular">Most Popular</option>
                            <option value="liked">Most Liked</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    )}
                </div>

                {/* Date Range Section */}
                <div className={`border-b pb-4 transition-colors ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <button
                        onClick={() => toggleSection('dateRange')}
                        className="w-full flex justify-between items-center mb-2 font-medium"
                    >
                        <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            Date Range
                        </span>
                        {expandedSections.dateRange ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.dateRange && (
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <label className="w-14 text-sm">From:</label>
                                <input
                                    type="date"
                                    value={currentFilters.from || ''}
                                    onChange={(e) => updateFilters({ from: e.target.value })}
                                    className={`w-full p-2 border rounded transition-colors ${isDarkMode
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                        }`}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="w-14 text-sm">To:</label>
                                <input
                                    type="date"
                                    value={currentFilters.to || ''}
                                    onChange={(e) => updateFilters({ to: e.target.value })}
                                    className={`w-full p-2 border rounded transition-colors ${isDarkMode
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                        }`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories Section */}
                {suggestions.categories.length > 0 && (
                    <div className={`border-b pb-4 transition-colors ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <button
                            onClick={() => toggleSection('categories')}
                            className="w-full flex justify-between items-center mb-2 font-medium"
                        >
                            <span>Categories</span>
                            {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {expandedSections.categories && (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                <label
                                    className={`flex items-center gap-2 p-1.5 rounded hover:bg-opacity-10 cursor-pointer ${isDarkMode ? "hover:bg-gray-400" : "hover:bg-gray-100"
                                        } ${!currentFilters.category ? "font-medium" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        value=""
                                        checked={!currentFilters.category}
                                        onChange={() => updateFilters({ category: "" })}
                                        className="accent-blue-500"
                                    />
                                    All Categories
                                </label>

                                {suggestions.categories.map((category) => (
                                    <label
                                        key={category._id}
                                        className={`flex items-center gap-2 p-1.5 rounded transition-colors hover:bg-opacity-10 cursor-pointer ${isDarkMode ? "hover:bg-gray-400" : "hover:bg-gray-100"
                                            } ${currentFilters.category === category._id ? "font-medium" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category._id}
                                            checked={currentFilters.category === category._id}
                                            onChange={() => updateFilters({ category: category._id })}
                                            className="accent-blue-500"
                                        />
                                        <span className="flex-1 truncate">{category._id}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                            }`}>
                                            {category.count}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tags Section */}
                {suggestions.tags.length > 0 && (
                    <div className={`border-b pb-4 transition-colors ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <button
                            onClick={() => toggleSection('tags')}
                            className="w-full flex justify-between items-center mb-2 font-medium"
                        >
                            <span>Popular Tags</span>
                            {expandedSections.tags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {expandedSections.tags && (
                            <div className="flex flex-wrap gap-2">
                                {suggestions.tags.map((tag) => (
                                    <button
                                        key={tag._id}
                                        onClick={() => updateFilters({
                                            tag: currentFilters.tag === tag._id ? "" : tag._id
                                        })}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${currentFilters.tag === tag._id
                                                ? isDarkMode
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 text-white'
                                                : isDarkMode
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag._id}
                                        <span className="ml-1 opacity-80">({tag.count})</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Clear Filters Button */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className={`w-full py-2.5 rounded transition-colors ${isDarkMode
                                ? "bg-gray-700 text-red-400 hover:bg-gray-600"
                                : "text-red-500 hover:text-red-600 hover:bg-red-50"
                            }`}
                    >
                        Clear All Filters
                    </button>
                )}

                {/* Mobile Close Button */}
                <div className="mt-4 lg:hidden">
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`w-full py-2.5 rounded font-medium transition-colors ${isDarkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SearchFilters({ currentFilters, suggestions }: SearchFiltersProps) {
    return (
        <Suspense fallback={<LoadingEffect />}>
            <Filters currentFilters={currentFilters} suggestions={suggestions} />
        </Suspense>
    );
}