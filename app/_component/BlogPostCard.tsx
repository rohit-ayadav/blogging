import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon, ArrowRight, Clipboard } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from '@/components/ui/card';
import { UserType, BlogPostType } from '@/types/blogs-types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from '@/context/ThemeContext';
import { formatDate } from '@/lib/formatDate';

const BlogPostCard = ({ post, user }: { post: BlogPostType; user: UserType }) => {
    const categoryColors = getCategoryColor(post.category);
    const formattedDate = formatDate(post.createdAt);
    const { isDarkMode } = useTheme();

    return (
        <TooltipProvider>
            <Card className={`
                group relative overflow-hidden transition-all duration-300 flex flex-col h-full 
                ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
                border-2
                hover:shadow-2xl hover:border-opacity-50 
                rounded-xl 
                transform hover:-translate-y-2 hover:scale-[1.02]
            `}>
                {/* Thumbnail Section */}
                <div className="relative h-56 lg:h-64 overflow-hidden rounded-t-xl">
                    {post.thumbnail ? (
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0 bg-black/50" />
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 
                            group-hover:scale-110 
                            brightness-90 group-hover:brightness-75"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).onerror = null;
                                    (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                                }}
                            />
                        </div>
                    ) : (
                        <div className={`
                            absolute inset-0 flex items-center justify-center 
                            ${isDarkMode
                                ? 'bg-gradient-to-br from-gray-800 to-gray-700'
                                : 'bg-gradient-to-br from-gray-100 to-gray-200'}
                        `}>
                            <ImageIcon className={`
                                h-16 w-16 opacity-50
                                ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                            `} />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span className={`
                            inline-flex items-center px-3 py-1 rounded-full 
                            text-sm font-semibold tracking-wide 
                            transition-all duration-300 
                            hover:scale-105 hover:shadow-lg 
                            ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border}
                            shadow-sm
                        `}>
                            {post.category}
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <CardTitle className="text-2xl font-bold line-clamp-2 mb-3 drop-shadow-lg transition-all duration-300 group-hover:text-opacity-90">
                            {post.title}
                        </CardTitle>

                        <div className="flex items-center justify-between text-gray-100 text-sm">
                            <div className="flex items-center space-x-2">
                                <FaCalendarAlt className="h-4 w-4 opacity-80" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                    <FaEye className="h-4 w-4 opacity-80" />
                                    <span className="font-medium">{post.views || 0}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FaThumbsUp className="h-4 w-4 opacity-80" />
                                    <span className="font-medium">{post.likes || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="flex-grow p-6">
                    <p className={`
                        line-clamp-4 text-base leading-relaxed
                        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                        {post.content.replace(/<[^>]+>/g, '')}
                    </p>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-6 pt-0 space-y-4 sm:space-y-0">
                    {/* User Section */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <Avatar className={`
                            w-10 h-10 ring-2 ring-offset-2
                            ${isDarkMode ? 'ring-blue-900' : 'ring-blue-100'}
                        `}>
                            <AvatarImage
                                src={user?.image}
                                alt={user?.name}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                <FaUserCircle className="w-full h-full text-gray-400" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className={`
                                text-sm font-semibold
                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}
                            `}>
                                {user?.name || 'Anonymous'}
                            </span>
                            <span className={`
                                text-xs
                                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                                {user?.bio?.slice(0, 30) || 'No bio available'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        <Tooltip>
                            <TooltipTrigger>
                                <div
                                    className="flex items-center space-x-1 cursor-pointer"
                                    onClick={() => {
                                        const text = `Read this amazing blog post titled ${post.title} by ${user.name} on ${formattedDate}\n\nRead more at ${window.location.origin}/blogs/${post.slug}`;
                                        navigator.clipboard.writeText(text);
                                        toast.success('Link copied to clipboard');
                                    }}
                                >
                                    <Clipboard className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                </div>
                                <TooltipContent>Copy Link to Share</TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href={`/blogs/${post.slug}`} passHref>
                                    <span
                                        className={`
                    group w-full inline-flex items-center ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-700'}
                    transition-all duration-300 rounded-full cursor-pointer
                `}
                                    >
                                        Read More
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Click to read the full post</TooltipContent>
                        </Tooltip>
                    </div>
                </CardFooter>
            </Card>
        </TooltipProvider>
    );
};

const SkeletonCard = () => {
    const { isDarkMode } = useTheme();

    return (
        <Card className="overflow-hidden animate-pulse">
            <div className={`h-48 sm:h-56 lg:h-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <CardHeader>
                <div className={`h-6 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-4 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-4 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </CardContent>
            <CardFooter>
                <div className={`h-10 w-full rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </CardFooter>
        </Card>
    );
};

export { BlogPostCard, SkeletonCard };

export const getCategoryColor = (category: string): { bg: string; text: string; border: string } => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
        DSA: {
            bg: 'bg-blue-100/90 dark:bg-blue-900/90',
            text: 'text-blue-800 dark:text-blue-200',
            border: 'border-blue-200 dark:border-blue-800'
        },
        WebDev: {
            bg: 'bg-purple-100/90 dark:bg-purple-900/90',
            text: 'text-purple-800 dark:text-purple-200',
            border: 'border-purple-200 dark:border-purple-800'
        },
        "Job Posting": {
            bg: 'bg-green-100/90 dark:bg-green-900/90',
            text: 'text-green-800 dark:text-green-200',
            border: 'border-green-200 dark:border-green-800'
        },
        AI: {
            bg: 'bg-orange-100/90 dark:bg-orange-900/90',
            text: 'text-orange-800 dark:text-orange-200',
            border: 'border-orange-200 dark:border-orange-800'
        },
        ML: {
            bg: 'bg-red-100/90 dark:bg-red-900/90',
            text: 'text-red-800 dark:text-red-200',
            border: 'border-red-200 dark:border-red-800'
        },
        "Skill Development": {
            bg: 'bg-yellow-100/90 dark:bg-yellow-900/90',
            text: 'text-yellow-800 dark:text-yellow-200',
            border: 'border-yellow-200 dark:border-yellow-800'
        },
        "Resume and Cover Letter Guidance": {
            bg: 'bg-indigo-100/90 dark:bg-indigo-900/90',
            text: 'text-indigo-800 dark:text-indigo-200',
            border: 'border-indigo-200 dark:border-indigo-800'
        },
        "Interview Preparation": {
            bg: 'bg-pink-100/90 dark:bg-pink-900/90',
            text: 'text-pink-800 dark:text-pink-200',
            border: 'border-pink-200 dark:border-pink-800'
        },
        "Tech-news": {
            bg: 'bg-cyan-100/90 dark:bg-cyan-900/90',
            text: 'text-cyan-800 dark:text-cyan-200',
            border: 'border-cyan-200 dark:border-cyan-800'
        },
        Internship: {
            bg: 'bg-teal-100/90 dark:bg-teal-900/90',
            text: 'text-teal-800 dark:text-teal-200',
            border: 'border-teal-200 dark:border-teal-800'
        },
        Others: {
            bg: 'bg-gray-100/90 dark:bg-gray-800/90',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-gray-200 dark:border-gray-700'
        }
    };
    return colors[category] || colors.Others;
};