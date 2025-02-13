// app/blogs/[id]/page.tsx
import React from 'react';
import BlogPostLayout from '@/components/BlogPostLayout/page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Blog from '@/models/blogs.models';
import User from '@/models/users.models';
import { connectDB, disconnectDB } from '@/utils/db';
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
        if (isValidObjectId(id))
            post = await Blog.findById(id);
        else
            if (isValidSlug(id)) post = await Blog.findOne({ slug: id });

        if (!post) {
            return {
                success: false,
                statusCode: 404,
                error: 'Blog post not found',

            };
        }
        // Increment views
        await Blog.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } });
        let author: Author = await User.findOne({ email: post.createdBy }) as Author;

        if (!author) {
            author = {
                name: 'Anonymous',
                image: '/default-profile.jpg',
                _id: '0',
                likes: 0,
                views: 0
            };
        }

        const plainPost = JSON.parse(JSON.stringify(post));
        const plainAuthor: Author = JSON.parse(JSON.stringify(author));
        // await disconnectDB();
        return {
            success: true,
            data: plainPost,
            author: plainAuthor,
            statusCode: 200,
        };
    }
    catch (error) {
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
            description: 'Unable to load blog post'
        };
    }

    const postData = response.data;
    const title = postData?.title || 'DevBlogger Blog Post';
    const thumbnailUrl = postData?.thumbnail || '/default-thumbnail.png';
    const description = postData?.content.replace(/<[^>]*>?/gm, '').substring(0, 200);
    const url = `https://blogging-one-omega.vercel.app/blogs/${response.data.slug}`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [thumbnailUrl],
            url: url,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [thumbnailUrl],
        },
        keywords: postData?.tags?.join(', '),
        alternates: {
            canonical: url,
        },
    };
}


export async function generateStaticParams() {

    let posts = [];
    let paths = [];
    await connectDB();
    posts = await Blog.find({}, { slug: 1, _id: 1 });
    paths = posts.map(post => ({
        params: {
            id: post._id.toString(),
            slug: post.slug
        }
    }));
    // await disconnectDB();
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

    return (
        <BlogPostLayout post={response.data} id={params.id} isLoading={false} author={response.author || { name: 'Anonymous', image: '/default-profile.jpg', _id: '0', likes: 0, views: 0 }}>
            <BlogPostClientContent initialData={response.data} id={params.id} author={response.author || { name: 'Anonymous', image: '/default-profile.jpg', _id: '0', likes: 0, views: 0 }} />
        </BlogPostLayout>
    );
}