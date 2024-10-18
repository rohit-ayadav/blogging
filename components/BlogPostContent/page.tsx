"use client";

import React from 'react';
import useBlogPost from '../../hooks/useBlogPost';
import BlogPostHeader from '../BlogPostHeader/page';
import BlogPostContent from '../BlogPostContent011/page';
import BlogPostFooter from '../BlogPostFooter/page';
import RelatedPosts from '../RelatedPosts/page';
import AuthorPosts from '../AuthorPosts/page';
import NewsLetter from '@/app/component/newsletter';
import CommentSection from '@/app/component/commentsection';

interface BlogPostClientContentProps {
    initialData: any;
    id: string;
}

const BlogPostClientContent: React.FC<BlogPostClientContentProps> = ({ initialData, id }) => {
    const { post, author, relatedPosts, authorPosts, likes, views, liked } = useBlogPost(id, initialData);


    if (!post || !author) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <BlogPostHeader post={post} author={author} />
            {post ? (
                <>
                    <BlogPostContent post={post} />
                    <BlogPostFooter post={post} likes={likes} views={views} liked={liked} id={id} />
                    <CommentSection postId={id} />
                    <RelatedPosts posts={relatedPosts} />
                    <NewsLetter />
                    <AuthorPosts author={author} posts={authorPosts} />
                </>
            ) : (
                <div className="flex justify-center items-center h-screen">Loading content...</div>
            )}
        </>
    );
};

export default BlogPostClientContent;
