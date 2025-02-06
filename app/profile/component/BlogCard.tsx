
// BlogCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ThumbsUp, Edit2, Trash2, ImageIcon } from 'lucide-react';
import { BlogPostType } from '@/types/blogs-types';

interface BlogCardProps {
    blog: BlogPostType;
    loading: boolean;
    handleEditBlog: (id: string) => void;
    handleDeleteBlog: (id: string) => void;
    handleViewBlog: (id: string) => void;
}

export const BlogCard = ({ blog, loading, handleEditBlog, handleDeleteBlog, handleViewBlog }: BlogCardProps) => {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <div className="relative w-full pt-[56.25%] bg-gray-200">
                {blog.thumbnail ? (
                    <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                )}
            </div>
            <CardContent className="flex-grow p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{blog.views}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{blog.likes}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditBlog(blog._id)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteBlog(blog._id)}>
                        {loading ? 'Deleting...' : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewBlog(blog._id)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
