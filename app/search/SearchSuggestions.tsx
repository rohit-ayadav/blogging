"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense } from "react";
import LoadingEffect from "@/lib/LoadingEffect";
import { useTheme } from "@/context/ThemeContext";

type SearchSuggestionsProps = {
    suggestions: {
        categories: Array<{ _id: string; count: number }>;
        tags: Array<{ _id: string; count: number }>;
    };
    currentQuery?: string;
};

const getSuggestions = ({ suggestions, currentQuery }: SearchSuggestionsProps) => {
    const allSuggestions: Array<{ type: string; text: string; value: string }> = [];

    if (currentQuery) {
        suggestions.categories.forEach(category => {
            allSuggestions.push({
                type: 'category',
                text: `${currentQuery} in ${category._id}`,
                value: category._id
            });
        });

        suggestions.tags.slice(0, 3).forEach(tag => {
            allSuggestions.push({
                type: 'tag',
                text: `${currentQuery} with tag ${tag._id}`,
                value: tag._id
            });
        });
    }

    return allSuggestions;
};

function Suggestions({ suggestions, currentQuery }: SearchSuggestionsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isDarkMode } = useTheme();

    const handleSuggestionClick = (type: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(type, value);
        router.push(`/search?${params.toString()}`);
    };

    const searchSuggestions = getSuggestions({ suggestions, currentQuery });

    if (searchSuggestions.length === 0) return null;

    return (
        <div className="mb-6 w-full">
            <h2 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Suggested Searches
            </h2>
            <div className="flex flex-wrap gap-2 max-w-full">
                {searchSuggestions.map(suggestion => (
                    <button
                        key={suggestion.text}
                        onClick={() => handleSuggestionClick(suggestion.type, suggestion.value)}
                        className={`
                            text-sm px-3 py-1.5 rounded-lg transition-colors
                            flex items-center gap-1.5 
                            ${isDarkMode
                                ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:text-blue-600 hover:border-blue-300'}
                        `}
                    >
                        <Search size={14} />
                        <span className="truncate">{suggestion.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function SearchSuggestions({ suggestions, currentQuery }: SearchSuggestionsProps) {
    return (
        <Suspense fallback={<LoadingEffect />}>
            <Suggestions suggestions={suggestions} currentQuery={currentQuery} />
        </Suspense>
    )
}