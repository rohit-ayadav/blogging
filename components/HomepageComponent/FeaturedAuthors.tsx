import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Users } from 'react-feather';
import { UserType } from '@/types/blogs-types';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturedAuthors = ({ users }: { users: UserType[] }) => {
    const { isDarkMode } = useTheme();

    // Sort users by number of blogs or followers to determine "trending" authors
    const trendingAuthors = [...users]
        .sort((a, b) => (b.follower + b.noOfBlogs) - (a.follower + a.noOfBlogs))
        .slice(0, 5);

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 text-center">Trending Authors</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {trendingAuthors.map((author, index) => (
                        <motion.div
                            key={author._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link href={`/author/${author.username}`}>
                                <Card className={`h-full transition-all duration-300 
                  ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'}`}
                                >
                                    <CardContent className="pt-6 flex flex-col items-center">
                                        <div className="mb-4 w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
                                            {author.image ? (
                                                <img
                                                    src={author.image}
                                                    alt={author.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                    {author.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg font-semibold mb-1 text-center">
                                            {author.name}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                                            @{author.username}
                                        </p>
                                        <div className="flex space-x-3 mb-3">
                                            <Badge variant="outline" className="flex items-center">
                                                <Book size={12} className="mr-1" />
                                                {author.noOfBlogs}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center">
                                                <Users size={12} className="mr-1" />
                                                {author.follower}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {author.bio || "Tech enthusiast and content creator"}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedAuthors;