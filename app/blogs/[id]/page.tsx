// app/blogs/[id]/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import BlogPostLayout from '../../../components/BlogPostLayout/page';
import { Metadata } from 'next';


const BlogPostClientContent = dynamic(
    () => import('../../../components/BlogPostContent/page'),
    { ssr: false }
);

async function getPostData(id: string) {
    try {
        const res = await fetch(`https://blogging-one-omega.vercel.app/api/blog/${id}`);
        const postData = await res.json();
        if(!postData) {
            throw new Error('Post not found');
        }
        if(!res.ok) {
            throw new Error(postData.message || 'Failed to fetch post data');
        }

        return postData.data;
    }
    catch (error) {
        // console.error('Error fetching post data:', error);
        throw new Error('Error fetching post data' + error);
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const postData = await getPostData(params.id);

    const title = postData?.title || 'Next.js Blog Post';
    const thumbnailUrl = postData?.thumbnail || '/default-thumbnail.png';
    // Remove HTML tags from description and traun
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
    }
}

export default async function IndividualBlogPost({ params }: { params: { id: string } }) {
    const id = params.id;
    const initialData = await getPostData(id);

    return (
        <BlogPostLayout post={initialData}>
            <BlogPostClientContent initialData={initialData} id={id} />
        </BlogPostLayout>
    );
};

