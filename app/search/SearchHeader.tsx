"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search as SearchIcon34, X, ArrowRight, History, Loader2
} from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';
interface SearchSuggestion {
    id: string;
    type: 'recent' | 'popular' | 'category' | 'tag';
    text: string;
    category?: string;
    tag?: string;
}

function Search({ currentQuery = '' }: { currentQuery: string }) {
    const router = useRouter();
    const searchParams = currentQuery;
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(currentQuery);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Load recent searches from localStorage
    const getRecentSearches = (): SearchSuggestion[] => {
        if (typeof window === 'undefined') return [];
        const searches = localStorage.getItem('recentSearches');
        return searches ? JSON.parse(searches) : [];
    };

    // Save search to recent searches
    const saveToRecent = (searchQuery: string) => {
        const recent = getRecentSearches();
        const newSearch: SearchSuggestion = {
            id: Date.now().toString(),
            type: 'recent',
            text: searchQuery,
        };

        const updated = [newSearch, ...recent.filter(item =>
            item.text.toLowerCase() !== searchQuery.toLowerCase()
        )].slice(0, 5);

        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Fetch search suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedQuery.trim()) {
                setSuggestions(getRecentSearches());
                return;
            }

            setIsLoading(true);
            try {
                // You would typically fetch these from your API
                // This is a mock implementation
                const mockSuggestions: SearchSuggestion[] = [
                    {
                        id: '1',
                        type: 'category',
                        text: `${debouncedQuery} in Technology`,
                        category: 'technology'
                    },
                    {
                        id: '2',
                        type: 'tag',
                        text: `${debouncedQuery} with #webdev`,
                        tag: 'webdev'
                    },
                    {
                        id: '3',
                        type: 'popular',
                        text: `${debouncedQuery} tutorials`,
                    }
                ];

                setSuggestions([...getRecentSearches(), ...mockSuggestions]);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle search submission
    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        saveToRecent(searchQuery.trim());
        setIsOpen(false);

        const params = new URLSearchParams(searchParams.toString());
        params.set('q', searchQuery.trim());
        router.push(`/search?${params.toString()}`);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('q', suggestion.text);
        if (suggestion.category) params.set('category', suggestion.category);
        if (suggestion.tag) params.set('tag', suggestion.tag);

        saveToRecent(suggestion.text);
        setIsOpen(false);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div ref={searchRef} className="relative">
            {/* Search Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch(query);
                    }}
                    placeholder="Search..."
                    className="w-full md:w-[300px] lg:w-[400px] pl-10 pr-4 py-2 text-sm 
                             bg-gray-100 rounded-full focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:bg-white transition-all"
                />
                <SearchIcon34 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                                 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Search Suggestions Dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg 
                               border border-gray-200 max-h-[400px] overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="py-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 
                                             flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        {suggestion.type === 'recent' ? (
                                            <History className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <SearchIcon34 className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span>{suggestion.text}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 
                                                         group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchHeader() {
    return (
        <div className="container mx-auto px-4 py-6">
            <Search currentQuery={''} />
        </div>
    );
}