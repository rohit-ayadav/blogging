"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/date-formatter";

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
    }>;
    currentPage: number;
    totalPages: number;
    searchParams: SearchParams;
};

export default function SearchResults({ results }: SearchResultProps) {
    return (
        <div className="space-y-6">
            {results.map((result) => (
                <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                    {result.type === 'blog' ? (
                        <BlogResult result={result} />
                    ) : (
                        <UserResult result={result} />
                    )}
                </div>
            ))}

            {results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No results found</p>
                </div>
            )}
        </div>
    );
}

function BlogResult({ result }: { result: any }) {
    return (
        <Link href={`/blog/${result.slug}`}>
            <div className="flex gap-4">
                {result.thumbnail && (
                    <div className="flex-shrink-0">
                        {/* <Image
                            src={result.thumbnail}
                            alt={result.title}
                            width={120}
                            height={80}
                            className="rounded-md object-cover"
                        /> */}
                        <img src={result.thumbnail} alt={result.title} width={120} height={80} className="rounded-md object-cover" />
                    </div>
                )}
                <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                    <p className="text-gray-600 line-clamp-2">{result.content.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ').slice(0, 250)}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(new Date(result.createdAt))}</span>
                        <span>{result.category}</span>
                        {result.tags && result.tags.length > 0 && (
                            <span>{result.tags.slice(0, 4).join(', ')}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function UserResult({ result }: { result: any }) {
    return (
        <Link href={`/author/${result.username}`}>
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    <Image
                        src={result.image || '/default-profile.jpg'}
                        alt={result.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                </div>
                <div>
                    <h2 className="font-semibold">{result.name}</h2>
                    <p className="text-gray-500">@{result.username}</p>
                    {result.bio && (
                        <p className="text-gray-600 line-clamp-2 mt-1">{result.bio}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}