import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import User from "@/models/users.models";
import { Metadata } from "next";
import serializeDocument from "@/utils/date-formatter";
import { Suspense } from "react";
import LoadingEffect from "@/lib/LoadingEffect";
import SearchPageContent from "./SearchPageContent";

export type SearchParams = {
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

export const dynamic = "force-dynamic";

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
                    .where('noOfBlogs').gt(0)
                    .sort({ noOfBlogs: -1 })
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
    const category = searchParams.category ? ` in ${searchParams.category}` : '';
    const tag = searchParams.tag ? ` with tag ${searchParams.tag}` : '';

    return {
        title: `Search: ${query}${category}${tag} - ${type} | DevBlogger`,
        description: `Search results for ${query} in ${type}${category}${tag}. Filter by category, tags, date and more.`,
        openGraph: {
            title: `Search: ${query}${category}${tag} - ${type}`,
            description: `Search results for ${query} in ${type}${category}${tag}. Filter by category, tags, date and more.`,
        },
    };
}

async function SearchPage({ searchParams, }: { searchParams: SearchParams; }) {
    const { results, totalCount, totalPages, currentPage, suggestions } =
        await getSearchResults(searchParams);

    return (
        <SearchPageContent
            results={results}
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={currentPage}
            suggestions={suggestions}
            searchParams={searchParams}
        />
    );
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
    return (
        <Suspense fallback={<LoadingEffect />}>
            <SearchPage searchParams={searchParams} />
        </Suspense>
    );
}