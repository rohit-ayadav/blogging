"use client";

import { useTheme } from "@/context/ThemeContext";
import { SearchParams } from "./page";
import HeaderSearch from "./PageHeaderSearch";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import SearchSuggestions from "./SearchSuggestions";

function SearchPageContent({
    results,
    totalCount,
    totalPages,
    currentPage,
    suggestions,
    searchParams,
}: {
    results: any[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    suggestions: any;
    searchParams: SearchParams;
}) {
    const { isDarkMode } = useTheme();

    return (
        <main className="container mx-auto px-4 py-6 md:py-8">
            <div className="mb-6">
                {/* <HeaderSearch initialQuery={searchParams.q} /> */}
                <HeaderSearch initialQuery={searchParams.q} placeholder="Search..." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <div className="sticky top-4">
                        <SearchFilters
                            currentFilters={searchParams}
                            suggestions={suggestions}
                        />
                    </div>
                </div>

                <div className="lg:col-span-3 order-1 lg:order-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 sm:mb-0">
                            {searchParams.q
                                ? `Results for "${searchParams.q}"`
                                : 'All Content'}
                        </h1>
                        <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                            {totalCount} {totalCount === 1 ? 'result' : 'results'} found
                        </p>
                    </div>

                    <SearchSuggestions
                        suggestions={suggestions}
                        currentQuery={searchParams.q}
                    />

                    {results.length > 0 ? (
                        <SearchResults
                            results={results}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            searchParams={searchParams}
                        />
                    ) : (
                        searchParams.q ? (
                            <div className={`p-8 text-center border rounded-lg ${isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-gray-300'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                <h3 className="text-xl font-medium mb-2">No results found</h3>
                                <p className="mb-4">Try adjusting your search terms or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => window.location.href = '/search'}
                                    className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                                        }`}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className={`p-8 text-center border rounded-lg ${isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-gray-300'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                <h3 className="text-xl font-medium mb-2">No search query</h3>
                                <p className="mb-4">Enter a search term to find content.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </main>
    );
}

export default SearchPageContent;