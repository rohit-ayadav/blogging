// app/blogs/[id]/page.tsx
import React from 'react';
import BlogPostLayout from '@/components/BlogPostLayout/page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Blog from '@/models/blogs.models';
import User from '@/models/users.models';
import { connectDB } from '@/utils/db';
import { isValidObjectId } from 'mongoose';
import { Author, BlogPostType } from '@/types/blogs-types';
import { ErrorMessage } from './ErrorMessage';
import BlogPostClientContent from '@/components/BlogPostContent/page';
import { isValidSlug } from '@/lib/common-function';
import serializeDocument, { formatDate } from '@/utils/date-formatter';
interface ApiResponse {
    success: boolean;
    statusCode: number;
    error?: string;
    data?: BlogPostType;
    author?: Author;
}

async function getPostData(id: string): Promise<ApiResponse> {
    try {
        await connectDB();
        let post;

        if (isValidObjectId(id)) {
            post = await Blog.findById(id).lean().exec();
        } else if (isValidSlug(id)) {
            post = await Blog.findOne({ slug: id }).lean().exec();
        }

        if (!post) {
            return {
                success: false,
                statusCode: 404,
                error: 'Blog post not found'
            };
        }

        // Increment views
        await Blog.findOneAndUpdate(
            { slug: id },
            { $inc: { views: 1 } }
        );

        // Get author information
        const createdBy = Array.isArray(post) ? post[0]?.createdBy : post?.createdBy;
        const authorDoc = await User.findOne({ email: createdBy }).lean().exec();

        // Create default author if none found
        const author: Author = authorDoc ? serializeDocument(authorDoc) : {
            name: 'Anonymous',
            image: '/default-profile.jpg',
            _id: '0',
            likes: 0,
            views: 0,
        };

        // Serialize the post data
        const serializedPost = serializeDocument(post);
        const serializedAuthor = serializeDocument(author);

        return {
            success: true,
            data: serializedPost as BlogPostType,
            author: serializedAuthor as Author,
            statusCode: 200,
        };
    } catch (error) {
        return {
            success: false,
            error: (error as Error).message,
            statusCode: 500,
        };
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const response = await getPostData(params.id);

    if (!response.success || !response.data) {
        return {
            title: 'Error | Blog Post',
            description: 'Unable to load blog post',
        };
    }

    const postData = response.data;
    const title = postData?.title || 'TheFoodBlogger Blog Post';
    const thumbnailUrl = postData?.thumbnail || '/default-thumbnail.png';
    const description = postData?.content.replace(/<[^>]*>?/gm, '').substring(0, 200);
    const url = `https://www.food.devblogger.in/blogs/${response.data.slug}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [thumbnailUrl],
            url,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [thumbnailUrl],
        },
        keywords: postData?.tags?.join(', '),
        alternates: {
            canonical: url,
        },
    };
}

export async function generateStaticParams() {
    await connectDB();
    const posts = await Blog.find({}, { slug: 1, _id: 1 });
    const paths = [] as { params: { id: string } }[];
    posts.forEach(post => {
        paths.push({
            params: {
                id: post._id.toString(),
            }
        });
        paths.push({
            params: {
                id: post.slug,
            }
        });
    })

    return paths;
}

export default async function IndividualBlogPost({ params }: { params: { id: string } }) {
    const response = await getPostData(params.id);

    if (!response || !response.success) {
        switch (response.statusCode) {
            case 404:
                notFound();
            case 403:
                return <ErrorMessage message="You don't have permission to view this blog post" />;
            case 401:
                return <ErrorMessage message="Please login to view this blog post" />;
            default:
                return <ErrorMessage message={response.error || 'Failed to load blog post'} />;
        }
    }

    if (!response.author) {
        return <ErrorMessage message="Author not found" />;
    }
    if (!response.data) {
        return <ErrorMessage message="Blog post not found" />;
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: response.data.title,
        image: response.data.thumbnail,
        datePublished: response.data.createdAt,
        dateModified: response.data.updatedAt,
        description: response.data.content.replace(/<[^>]*>?/gm, '').substring(0, 250),
        author: {
            '@type': 'Person',
            name: response.author?.name || 'Anonymous',
        },
        publisher: {
            '@type': 'Organization',
            name: 'TheFoodBlogger',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.food.devblogger.in/path/to/logo.png',
            },
        },
    };



    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostLayout
                post={response.data}
                id={params.id}
                isLoading={false}
                author={response.author}
            >
                <BlogPostClientContent
                    initialData={response.data}
                    id={params.id}
                    author={response.author}
                />
            </BlogPostLayout>
        </>
    );
}