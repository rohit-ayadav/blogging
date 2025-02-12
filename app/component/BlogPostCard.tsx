import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
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
import { formatDate, getCategoryColor } from '@/lib/formatDate';


const BlogPostCard = ({ post, user }: { post: BlogPostType; user: UserType }) => {
    const categoryColors = getCategoryColor(post.category);
    const formattedDate = formatDate(post.createdAt);

    return (
        <TooltipProvider>
            <Card className="group relative overflow-hidden transition-all duration-300 flex flex-col h-full 
            bg-white dark:bg-gray-900 
            border-2 border-gray-200 dark:border-gray-700 
            hover:shadow-2xl hover:border-opacity-50 
            rounded-xl 
            transform hover:-translate-y-2 hover:scale-[1.02]">
                {/* Thumbnail Section */}
                <div className="relative h-56 lg:h-64 overflow-hidden rounded-t-xl">
                    {post.thumbnail ? (
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
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center 
                        bg-gradient-to-br from-gray-100 to-gray-200 
                        dark:from-gray-800 dark:to-gray-700">
                            <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 opacity-50" />
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
                    <p className="line-clamp-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                        {post.content.replace(/<[^>]+>/g, '')}
                    </p>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-6 pt-0 space-y-4 sm:space-y-0">
                    {/* User Section */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-blue-100 dark:ring-blue-900">
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
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {user?.name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.bio?.slice(0, 30) || 'No bio available'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        <Tooltip>
                            <TooltipTrigger>
                                {/* since button can not be inserted into tooltip, we need to use something else then button here */}
                                <div
                                    className="flex items-center space-x-1 cursor-pointer"
                                    onClick={() => toast.success('Copied to clipboard!')}
                                >
                                    <Clipboard className="h-5 w-5" />
                                    <TooltipContent>Copy Link to Share</TooltipContent>
                                </div>

                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href={`/blogs/${post.slug}`} passHref>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="group w-full hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 transition-all duration-300 rounded-full"
                                    >
                                        Read More
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
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

const SkeletonCard = () => (
    <Card className="overflow-hidden animate-pulse">
        <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 dark:bg-gray-700" />
        <CardHeader>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        </CardContent>
        <CardFooter>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </CardFooter>
    </Card>
);

export { BlogPostCard, SkeletonCard };