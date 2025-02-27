import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlogPostType } from '@/types/blogs-types';
import { PostCard } from '../PostCard';

interface BlogPostProps {
    blogs: BlogPostType[];
    monthlyStats: { blog: string; month: string; views: number; likes: number }[];
    sortedBlogs: BlogPostType[];
    sortBlogs: string;
    setSortBlogs: (value: string) => void;
}

const BlogPost = ({ blogs, monthlyStats, sortedBlogs, sortBlogs, setSortBlogs }: BlogPostProps) => {
    return (
        <div className="w-full">
            <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div>
                        <CardTitle>My Blog Posts</CardTitle>
                        <CardDescription>
                            All your published blog posts
                        </CardDescription>
                    </div>
                    <Select value={sortBlogs} onValueChange={setSortBlogs}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="liked">Most Liked</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    {blogs.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">You haven't published any blog posts yet.</p>
                        </div>
                    ) : sortedBlogs.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No blogs match your current filter. Try changing your sort option.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {sortedBlogs.map((post: BlogPostType) => {
                                const postStats = monthlyStats.filter(stat => stat.blog === post._id);
                                const totalViews = postStats.reduce((sum, stat) => sum + stat.views, 0);
                                const totalLikes = postStats.reduce((sum, stat) => sum + stat.likes, 0);

                                const enhancedPost = {
                                    ...post,
                                    views: totalViews,
                                    likes: totalLikes
                                };

                                return <PostCard key={post._id} post={enhancedPost} showStats={true} />;
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default BlogPost