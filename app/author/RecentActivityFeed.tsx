import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Book } from 'react-feather';
import { BlogPostType, UserType } from '@/types/blogs-types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/utils/date-formatter';

const RecentActivityFeed = ({ posts, users }: { posts: BlogPostType[], users: UserType[] }) => {
    const { isDarkMode } = useTheme();

    // Sort posts by creation date (newest first)
    const recentActivities = [...posts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8">Recent Activity</h2>

                <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                    {recentActivities.map((activity, index) => {
                        const author = users.find(user => user.email === activity.createdBy);
                        const timeAgo = formatRelativeTime(activity.createdAt);

                        return (
                            <motion.div
                                key={activity._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/blogs/${activity.slug}`}>
                                    <Card className={`transition-all duration-300 
                    ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                                    >
                                        <CardContent className="py-4 flex items-center">
                                            <div className="flex-shrink-0 mr-4">
                                                {author?.image ? (
                                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                                        <img
                                                            src={author.image}
                                                            alt={author.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                        {author?.name.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex items-center">
                                                    <p className="font-semibold">{author?.name || 'Unknown Author'}</p>
                                                    <Badge variant="outline" className="ml-2 px-2 py-0 text-xs">
                                                        {activity.category}
                                                    </Badge>
                                                </div>
                                                <p className="font-medium text-blue-600">{activity.title}</p>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <p>{timeAgo}</p>
                                                    <div className="mx-2">•</div>
                                                    <div className="flex items-center">
                                                        <Book size={12} className="mr-1" />
                                                        {activity.views || 0} views
                                                    </div>
                                                    <div className="mx-2">•</div>
                                                    <div className="flex items-center">
                                                        <Star size={12} className="mr-1" />
                                                        {activity.likes || 0} likes
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    <Link href="/blogs">
                        <Button variant="outline">
                            View All Activity
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentActivityFeed;