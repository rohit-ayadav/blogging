import { useMemo } from 'react';
import { BlogPostType } from '@/types/blogs-types';
import { Card, CardContent } from '@/components/ui/card';

export
    const AuthorStats = ({ posts }: { posts: BlogPostType[] }) => {
        const stats = useMemo(() => ({
            totalPosts: posts.length,
            totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
            totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
            categories: [...new Set(posts.map(post => post.category))].length
        }), [posts]);

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Posts', value: stats.totalPosts },
                    { label: 'Total Views', value: stats.totalViews.toLocaleString() },
                    { label: 'Total Likes', value: stats.totalLikes.toLocaleString() },
                    { label: 'Categories', value: stats.categories }
                ].map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };
