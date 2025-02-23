"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense } from "react";

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

    const handleSuggestionClick = (type: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(type, value);
        router.push(`/search?${params.toString()}`);
    };

    const searchSuggestions = getSuggestions({ suggestions, currentQuery });

    if (searchSuggestions.length === 0) return null;

    return (
        <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">
                Suggested Searches
            </h2>
            <div className="flex flex-wrap gap-2">
                {searchSuggestions.map(suggestion => (
                    <button
                        key={suggestion.text}
                        onClick={() => handleSuggestionClick(suggestion.type, suggestion.value)}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 rounded-lg px-3 py-1"
                    >
                        {suggestion.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function SearchSuggestions({ suggestions, currentQuery }: SearchSuggestionsProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Suggestions suggestions={suggestions} currentQuery={currentQuery} />
        </Suspense>
    )
}