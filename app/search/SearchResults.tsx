"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/date-formatter";
import { useTheme } from "@/context/ThemeContext";

type SearchParams = {
    q?: string;
    type?: string;
    category?: string;
    tag?: string;
    from?: string;
    to?: string;
    language?: string;
    page?: string;
    limit?: string;
    sort?: string;
};

type SearchResultProps = {
    results: Array<{
        type: string;
        id: string;
        title?: string;
        content?: string;
        createdAt: string;
        name?: string;
        username?: string;
        image?: string;
        category?: string;
        tags?: string[];
        slug?: string;
        thumbnail?: string;
        bio?: string;
    }>;
    currentPage: number;
    totalPages: number;
    searchParams: SearchParams;
};

export default function SearchResults({ results }: SearchResultProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className="space-y-4 md:space-y-6">
            {results.map((result) => (
                <div
                    key={result.id}
                    className={`border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow ${isDarkMode ? "border-gray-700 hover:shadow-gray-800" : "border-gray-200"
                        }`}
                >
                    {result.type === 'blog' ? (
                        <BlogResult result={result} />
                    ) : (
                        <UserResult result={result} />
                    )}
                </div>
            ))}

            {results.length === 0 && (
                <div className="text-center py-6 md:py-8">
                    <p className="text-gray-500">No results found</p>
                </div>
            )}
        </div>
    );
}

function BlogResult({ result }: { result: any }) {
    const { isDarkMode } = useTheme();

    return (
        <Link href={`/blogs/${result.slug}`}>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {result.thumbnail && (
                    <div className="flex-shrink-0 w-full sm:w-auto">
                        <img
                            src={result.thumbnail}
                            alt={result.title || "Blog thumbnail"}
                            className="w-full sm:w-24 md:w-32 h-40 sm:h-20 md:h-24 rounded-md object-cover"
                        />
                    </div>
                )}
                <div className="flex-grow">
                    <h2 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 line-clamp-2">
                        {result.title}
                    </h2>
                    <p className={`line-clamp-2 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {result.content?.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ').slice(0, 150)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                        <span>{formatDate(new Date(result.createdAt))}</span>
                        {result.category && (
                            <>
                                <span className="hidden xs:inline">•</span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                    {result.category}
                                </span>
                            </>
                        )}
                        {result.tags && result.tags.length > 0 && (
                            <div className="hidden sm:flex flex-wrap gap-1 items-center">
                                <span>•</span>
                                <div className="flex flex-wrap gap-1">
                                    {result.tags.slice(0, 2).map((tag: string, index: number) => (
                                        <span key={index} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                            {tag}
                                        </span>
                                    ))}
                                    {result.tags.length > 2 && (
                                        <span className="text-gray-500">+{result.tags.length - 2}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function UserResult({ result }: { result: any }) {
    const { isDarkMode } = useTheme();

    return (
        <Link href={`/author/${result.username}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        {/* <Image
                            src={result.image || '/default-profile.jpg'}
                            alt={result.name || "User profile"}
                            width={50}
                            height={50}
                            className="rounded-full w-10 h-10 md:w-12 md:h-12 object-cover"
                        /> */}
                        <img
                            src={result.image || '/default-profile.jpg'}
                            alt={result.name || "User profile"}
                            className="rounded-full w-10 h-10 md:w-12 md:h-12 object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="font-semibold">{result.name}</h2>
                        <p className="text-gray-500 text-sm">@{result.username}</p>
                    </div>
                </div>
                {result.bio && (
                    <p className={`text-sm md:text-base line-clamp-2 mt-1 sm:mt-0 sm:ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {result.bio}
                    </p>
                )}
            </div>
        </Link>
    );
}