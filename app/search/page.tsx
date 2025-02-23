"use server";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import User from "@/models/users.models";
import { Metadata } from "next";
import SearchFilters from "./SearchFilters";
import SearchSuggestions from "./SearchSuggestions";
import SearchResults from "./SearchResults";
import serializeDocument from "@/utils/date-formatter";
import HeaderSearch from "./SearchHeader";
import { Suspense } from "react";

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

async function getSearchResults(params: SearchParams) {
    try {
        await connectDB();
        if (!params.q && !params.category && !params.tag) {
            return {
                results: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: 1,
                suggestions: { categories: [], tags: [] }
            };
        }

        const page = parseInt(params.page || '1');
        const limit = parseInt(params.limit || '10');
        const skip = (page - 1) * limit;

        const query: any = {};
        const userQuery: any = {};

        // Basic text search across multiple fields
        if (params.q) {
            const searchRegex = new RegExp(params.q, 'i');
            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { tags: searchRegex },
                { category: searchRegex }
            ];
            userQuery.$or = [
                { name: searchRegex },
                { username: searchRegex },
                { bio: searchRegex }
            ];
        }

        // Specific filters
        if (params.category) query.category = params.category;
        if (params.tag) query.tags = params.tag;
        if (params.language) query.language = params.language;

        // Date range filter
        if (params.from || params.to) {
            query.createdAt = {};
            if (params.from) query.createdAt.$gte = new Date(params.from);
            if (params.to) query.createdAt.$lte = new Date(params.to);
        }

        // Sorting options
        let sortOption: any = { createdAt: -1 };
        switch (params.sort) {
            case 'popular':
                sortOption = { views: -1 };
                break;
            case 'liked':
                sortOption = { likes: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
        }

        // Execute searches based on type
        let results: any = [];
        let totalCount = 0;

        if (!params.type || params.type === 'blogs') {
            const [blogResults, blogCount] = await Promise.all([
                Blog.find(query)
                    .populate('createdBy', 'name username image')
                    .sort(sortOption)
                    .skip(skip)
                    .limit(limit),
                Blog.countDocuments(query)
            ]);

            totalCount += blogCount;
            results = results.concat(
                blogResults.map(blog => ({
                    type: 'blog',
                    ...blog.toObject(),
                    id: blog._id.toString()
                }))
            );
        }

        if (!params.type || params.type === 'users') {
            const [userResults, userCount] = await Promise.all([
                User.find(userQuery)
                    .select('-password -emailVerificationToken')
                    .skip(skip)
                    .limit(limit),
                User.countDocuments(userQuery)
            ]);

            totalCount += userCount;
            results = results.concat(
                userResults.map(user => ({
                    type: 'user',
                    ...user.toObject(),
                    id: user._id.toString()
                }))
            );
        }

        // Get popular categories and tags for suggestions
        const aggregations = await Blog.aggregate([
            { $match: query },
            {
                $facet: {
                    categories: [
                        { $group: { _id: '$category', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 }
                    ],
                    tags: [
                        { $unwind: '$tags' },
                        { $group: { _id: '$tags', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 }
                    ]
                }
            }
        ]);
        let sDocument = serializeDocument(results);
        // if results contain data in html format, remove it 
        sDocument = sDocument.map((d: any) => {
            if (d.content) {
                d.content = d.content.replace(/<[^>]*>?/gm, '');
            }
            return d;
        });

        return {
            results: sDocument,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            suggestions: {
                categories: aggregations[0].categories,
                tags: aggregations[0].tags
            }
        };
    } catch (error) {
        console.error('Search error:', error);
        throw new Error('Failed to perform search');
    }
}

export async function generateMetadata({ searchParams }: {
    searchParams: SearchParams
}): Promise<Metadata> {
    const query = searchParams.q || 'All content';
    const type = searchParams.type || 'all';

    return {
        title: `Search: ${query} - ${type}`,
        description: `Search results for ${query} in ${type}. Filter by category, tags, and date.`,
        openGraph: {
            title: `Search: ${query} - ${type}`,
            description: `Search results for ${query} in ${type}. Filter by category, tags, and date.`,
        },
    };
}

async function SearchPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { results, totalCount, totalPages, currentPage, suggestions } =
        await getSearchResults(searchParams);
    const { q } = searchParams;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <SearchFilters
                        currentFilters={searchParams}
                        suggestions={suggestions}
                    />
                </div>

                <div className="lg:col-span-3">
                    <div className="mb-6">
                        <HeaderSearch />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">
                            Search Results {searchParams.q ? `for "${searchParams.q}"` : ''}
                        </h1>
                        <p className="text-gray-600">{totalCount} results found</p>
                    </div>

                    <SearchSuggestions
                        suggestions={suggestions}
                        currentQuery={searchParams.q}
                    />

                    <SearchResults
                        results={results}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchParams={searchParams}
                    />
                </div>
            </div>
        </main>
    );
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPage searchParams={searchParams} />
        </Suspense>
    );
}