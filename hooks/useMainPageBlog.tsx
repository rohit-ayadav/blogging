import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BlogPostType, UserType } from '@/types/blogs-types';

interface Post {
    _id: string;
    title: string;
    image?: string;
    createdAt: string;
    content: string;
    tags: string[];
    createdBy: string;
    likes: number;
    bio?: string;
}

const useBlogData = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [users, setUsers] = useState<{ [key: string]: UserType }>({});
    const [stats, setStats] = useState({
        totalLikes: 0,
        totalViews: 0,
        totalBlogs: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResponse, postsResponse] = await Promise.all([
                    fetch('/api/stats/all'),
                    fetch('/api/blog?trending')
                ]);

                if (!statsResponse.ok || !postsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [statsData, postsData] = await Promise.all([
                    statsResponse.json(),
                    postsResponse.json()
                ]);

                setStats({
                    totalLikes: statsData.totalLikes,
                    totalViews: statsData.totalViews,
                    totalBlogs: statsData.totalBlogs,
                    totalUsers: parseInt(statsData.totalUsers)
                });

                const limitedPosts = postsData.data.slice(0, 3);
                setPosts(limitedPosts);

                const uniqueEmails = [...new Set(limitedPosts.map((post: Post) => post.createdBy))];
                const userResponses = await Promise.all(
                    uniqueEmails.map(email => fetch(`/api/user?email=${email}`))
                );

                const userDataPromises = userResponses.map(response => {
                    if (!response.ok) throw new Error(`User fetch failed: ${response.status}`);
                    return response.json();
                });

                const userDetails = await Promise.all(userDataPromises);

                const userMap = userDetails.reduce((acc, userData) => {
                    const user = userData.data;
                    return user ? { ...acc, [user.email]: user } : acc;
                }, {});

                setUsers(userMap);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
                toast.error('Failed to load blog data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        loading,
        error,
        posts,
        users,
        ...stats
    };
};

export { useBlogData };