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
        return postData.data;
    }
    catch (error) {
        console.error('Error fetching post data:', error);
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const postData = await getPostData(params.id);
    // console.log('postData Title:', postData.title);
    // console.log('postData Thumbnail:', postData.thumbnail);
    // console.log('postData Content:', postData.content? postData.content.substring(0, 150): 'No content found');

    const title = postData.title || 'Next.js Blog Post';
    const thumbnailUrl = postData.thumbnail || '/default-thumbnail.png';
    const description = postData.content ? postData.content.substring(0, 150) :
        // Write a default long generalised description here which suits all the blog posts
        'This is a blog post on Next.js blog application.';

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

const IndividualBlogPost = async ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const initialData = await getPostData(id);

    return (
        <BlogPostLayout post={initialData}>
            <BlogPostClientContent initialData={initialData} id={id} />
        </BlogPostLayout>
    );
};

export default IndividualBlogPost;
