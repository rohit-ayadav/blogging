"use client";
import React, { useEffect } from "react";
export default function Blog() {
    interface BlogPostData {
        thumbnail: string;
        title: string;
        tags: string;
        content: string;
    }

    const [blogPostData, setBlogPostData] = React.useState<BlogPostData | null>(null);
    useEffect(() => {
        const data = localStorage.getItem('blogPostData');
        const blogPostData1 = data ? JSON.parse(data) : null;
        setBlogPostData(blogPostData1);
    }, []);
    if (!blogPostData) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-5xl font-bold text-center mb-3">This is your blog page</h1>
                <p className="text-center" > Here you can see various blogs written by either you or someone else.</p>
                <div className="flex justify-center mt-5">
                    <a href="/blogs" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Blogs</a>
                    <a href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Create Blog</a>
                    <a href="/update" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Update Blog</a>
                    <a href="/delete" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Delete Blog</a>
                </div>
                <h1 className="text-5xl font-bold text-center mb-3">No blog post found</h1>
                <p className="text-center">Please create a blog post first.</p>
            </div>
        );
    }

    if (!blogPostData) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-5xl font-bold text-center mb-3">This is your blog page</h1>
                <p className="text-center" > Here you can see various blogs written by either you or someone else.</p>
                <div className="flex justify-center mt-5">
                    <a href="/blogs" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Blogs</a>
                    <a href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Create Blog</a>
                    <a href="/update" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Update Blog</a>
                    <a href="/delete" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Delete Blog</a>
                </div>
                <h1 className="text-5xl font-bold text-center mb-3">No blog post found</h1>
                <p className="text-center">Please create a blog post first.</p>
            </div>
        );
    }
    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-5xl font-bold text-center mb-3">This is your blog page</h1>
                <p className="text-center" > Here you can see various blogs written by either you or someone else.</p>
                <div className="flex justify-center mt-5">
                    <a href="/blogs" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Blogs</a>
                    <a href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Create Blog</a>
                    <a href="/update" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Update Blog</a>
                    <a href="/delete" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Delete Blog</a>
                </div>
                <h1 className="text-3xl font-bold text-center mb-3">Blog Post</h1>
                <div className="flex justify-center m-5 p-5">
                    <div className="bg-gray-100 p-5 mt-5 max-w-30">
                        {blogPostData.thumbnail ? (
                            <img src={blogPostData.thumbnail} alt="thumbnail" className="w-full h-80 object-cover" />
                        ) : (
                            <div className="w-full h-80 bg-gray-300"></div>
                        )}
                        <h1 className="text-3xl font-bold mt-3">{blogPostData.title}</h1>
                        <p className="text-lg text-gray-600 mt-3">Tags: {blogPostData.tags}</p>
                        <p className="mt-5">{blogPostData.content}</p>
                    </div>

                </div>
            </div>
        </>
    )
};