"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type HeaderSearchProps = {
    initialQuery?: string;
    placeholder?: string;
};

export default function HeaderSearch({
    initialQuery = "",
    placeholder = "Search for articles, topics, or keywords..."
}: HeaderSearchProps) {
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const { isDarkMode } = useTheme();

    // Update local query state when initialQuery prop changes
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("q", query.trim());

        // Reset to page 1 when new search is performed
        params.delete("page");

        router.push(`/search?${params.toString()}`);
    };

    const clearSearch = () => {
        setQuery("");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={`w-full rounded-lg shadow-sm transition-all ${isDarkMode ? "bg-gray-800" : "bg-white"
            } ${isFocused ? "ring-2 ring-blue-500" : "ring-1 ring-gray-300 dark:ring-gray-700"}`}>
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
                <div className="flex items-center pl-4">
                    <Search size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`w-full py-3 px-3 text-base focus:outline-none rounded-lg ${isDarkMode
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-500"
                        }`}
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className={`p-2 rounded-full hover:bg-opacity-10 ${isDarkMode ? "hover:bg-gray-400 text-gray-400" : "hover:bg-gray-200 text-gray-500"
                            }`}
                    >
                        <X size={18} />
                    </button>
                )}

                <button
                    type="submit"
                    className={`flex items-center justify-center h-full px-4 py-3 rounded-r-lg transition-colors ${query.trim()
                        ? isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        : isDarkMode
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    disabled={!query.trim()}
                >
                    <ArrowRight size={18} />
                </button>
            </form>
        </div>
    );
}