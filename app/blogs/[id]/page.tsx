// app/blogs/[id]/page.tsx
import React from 'react';
import BlogPostLayout from '@/components/BlogPostLayout/page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Blog from '@/models/blogs.models';
import User from '@/models/users.models';
import { connectDB } from '@/utils/db';
import { isValidObjectId } from 'mongoose';
import { Author } from '@/types/blogs-types';
import { ErrorMessage } from './ErrorMessage';
import BlogPostClientContent from '@/components/BlogPostContent/page';
import { isValidSlug } from '@/lib/common-function';

type ApiResponse = {
    success: boolean;
    data?: any;
    error?: string;
    statusCode?: number;
    author?: Author;
};

async function getPostData(id: string): Promise<ApiResponse> {
    try {
        await connectDB();
        let post;
        if (isValidObjectId(id)) {
            post = await Blog.findById(id);
        } else if (isValidSlug(id)) {
            post = await Blog.findOne({ slug: id });
        }

        if (!post) {
            return {
                success: false,
                statusCode: 404,
                error: 'Blog post not found',
            };
        }
        // Increment views
        await Blog.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } });
        let createdBy = Array.isArray(post) ? post[0]?.createdBy : post?.createdBy;
        let author: Author = (await User.findOne({ email: createdBy })) as Author;

        if (!author) {
            author = {
                name: 'Anonymous',
                image: '/default-profile.jpg',
                _id: '0',
                likes: 0,
                views: 0,
            };
        }

        // Convert Mongoose document to plain object
        if (!Array.isArray(post)) {
            post.createdAt = post.createdAt.toISOString();
            post.updatedAt = post.updatedAt.toISOString();
            (post as any)._id = (post as any)._id.toString();
        }

        author._id = author._id.toString();

        const plainPost = JSON.parse(JSON.stringify(post));
        const plainAuthor: Author = JSON.parse(JSON.stringify(author));
        return {
            success: true,
            data: plainPost,
            author: plainAuthor,
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
    const title = postData?.title || 'DevBlogger Blog Post';
    const thumbnailUrl = postData?.thumbnail || '/default-thumbnail.png';
    const description = postData?.content.replace(/<[^>]*>?/gm, '').substring(0, 200);
    const url = `https://blogging-one-omega.vercel.app/blogs/${response.data.slug}`;

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
    const paths = posts.map(post => ({
        params: {
            id: post._id.toString(),
            slug: post.slug,
        },
    }));
    return paths;
}

export default async function IndividualBlogPost({ params }: { params: { id: string } }) {
    const response = await getPostData(params.id);

    if (!response || !response.success) {
        switch (response.statusCode) {
            case 404:
                notFound(); // This will render the 404 page
            case 403:
                return <ErrorMessage message="You don't have permission to view this blog post" />;
            case 401:
                return <ErrorMessage message="Please login to view this blog post" />;
            default:
                return <ErrorMessage message={response.error || 'Failed to load blog post'} />;
        }
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
            name: 'DevBlogger',
            logo: {
                '@type': 'ImageObject',
                url: 'https://blogging-one-omega.vercel.app/path/to/logo.png',
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
                author={
                    response.author || {
                        name: 'Anonymous',
                        image: '/default-profile.jpg',
                        _id: '0',
                        likes: 0,
                        views: 0,
                    }
                }
            >
                <BlogPostClientContent
                    initialData={response.data}
                    id={params.id}
                    author={
                        response.author || {
                            name: 'Anonymous',
                            image: '/default-profile.jpg',
                            _id: '0',
                            likes: 0,
                            views: 0,
                        }
                    }
                />
            </BlogPostLayout>
        </>
    );
}
