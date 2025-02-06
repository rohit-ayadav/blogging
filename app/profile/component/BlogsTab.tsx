
// BlogsTab.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BlogCard } from './BlogCard';
import { BlogPostType } from '@/types/blogs-types';

interface BlogsTabProps {
    userBlogs: BlogPostType[];
    loading: boolean;
    handleEditBlog: (id: string) => void;
    handleDeleteBlog: (id: string) => void;
    handleViewBlog: (id: string) => void;
}

export const BlogsTab = ({ userBlogs, loading, handleEditBlog, handleDeleteBlog, handleViewBlog }: BlogsTabProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Blogs</CardTitle>
            </CardHeader>
            <CardContent>
                {userBlogs.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">You have not created any blogs yet.</p>
                        <Link href="/create" className="text-blue-500 hover:underline">
                            Click here to create your first blog
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {userBlogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                blog={blog}
                                loading={loading}
                                handleEditBlog={handleEditBlog}
                                handleDeleteBlog={handleDeleteBlog}
                                handleViewBlog={handleViewBlog}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
