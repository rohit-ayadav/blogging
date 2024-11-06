// app/blogs/[id]/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import BlogPostLayout from '../../../components/BlogPostLayout/page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import toast from 'react-hot-toast';

// Error message components
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl w-full">
            <div className="flex">
                <div>
                    <p className="text-red-700">Error</p>
                    <p className="text-red-700 mt-1">{message}</p>
                </div>
            </div>
        </div>
    </div>
);

const BlogPostClientContent = dynamic(
    () => import('../../../components/BlogPostContent/page'),
    { ssr: false }
);

type ApiResponse = {
    success: boolean;
    data?: any;
    error?: string;
    statusCode?: number;
    // language?: string;
};

async function getPostData(id: string): Promise<ApiResponse> {
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/blog/${id}`;

    try {
        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data.message || 'Failed to fetch blog post',
                statusCode: res.status
            };
        }

        return {
            success: true,
            data: data.data,
            statusCode: res.status,
            // language: data.language,
        };
    } catch (error) {
        console.error('Error fetching post data:', error);
        return {
            success: false,
            // error: 'An unexpected error occurred while fetching the blog post',
            error: (error as Error).message,
            statusCode: 500
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
    const title = postData?.title || 'Next.js Blog Post';
    const thumbnailUrl = postData?.thumbnail || '/default-thumbnail.png';
    const description = postData?.content.replace(/<[^>]*>?/gm, '').substring(0, 200);
        
    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [thumbnailUrl],
            url: `https://blogging-one-omega.vercel.app/blogs/${params.id}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [thumbnailUrl],
        },
        keywords: postData?.tags?.join(', '),
    };
}

export default async function IndividualBlogPost({ params }: { params: { id: string } }) {
    const response = await getPostData(params.id);

    
    if (!response.success) {
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


    return (
        <BlogPostLayout post={response.data}>
            <BlogPostClientContent initialData={response.data} id={params.id} />
        </BlogPostLayout>
    );
}