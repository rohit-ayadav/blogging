import Link from 'next/link';
import { FaCalendarAlt, FaClipboard, FaEye, FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Eye, ImageIcon, ThumbsUp, User } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from '@/components/ui/card';
import { UserType, BlogPostType } from '@/types/blogs-types';


const getCategoryColor = (category: string): { bg: string; text: string; border: string } => {
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

const BlogPostCard = ({ post, user }: { post: BlogPostType; user: UserType }) => {
    const categoryColors = getCategoryColor(post.category);

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 flex flex-col h-full 
            bg-white dark:bg-gray-900 
            border-2 border-gray-200 dark:border-gray-700 
            hover:shadow-2xl hover:border-opacity-50 
            rounded-xl 
            transform hover:-translate-y-2 hover:scale-[1.02]">
            {/* Thumbnail Section with Improved Overlay */}
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
                {/* Improved Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge with Enhanced Styling */}
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

                {/* Title and Metadata with Improved Typography */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <CardTitle className="
                        text-2xl font-bold 
                        line-clamp-2 
                        mb-3 
                        drop-shadow-lg 
                        transition-all duration-300 
                        group-hover:text-opacity-90
                    ">
                        {post.title}
                    </CardTitle>

                    {/* Enhanced Metadata Section */}
                    <div className="flex items-center justify-between text-gray-100 text-sm">
                        <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="h-4 w-4 opacity-80" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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

            {/* Content Preview Section */}
            <CardContent className="flex-grow p-6">
                <p className="
                    line-clamp-4 
                    text-gray-700 dark:text-gray-300 
                    text-base 
                    leading-relaxed
                ">
                    {post.content.replace(/<[^>]+>/g, '')}
                </p>
            </CardContent>

            {/* Footer Section with Enhanced User and Action Layout */}
            <CardFooter className="
                flex flex-col sm:flex-row 
                justify-between 
                items-center 
                p-6 pt-0 
                space-y-4 sm:space-y-0
            ">
                {/* User Section */}
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <Avatar className="
                        w-10 h-10 
                        ring-2 ring-offset-2 
                        ring-blue-100 dark:ring-blue-900
                    ">
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
                            {user?.name || 'Unknown Author'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.bio?.slice(0, 30) || 'No bio available'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `${post.title}\nRead here: ${window.location.origin}/blogs/${post._id}\n\n`
                            );
                            toast.success('Blog link copied!', {
                                icon: '📋',
                                style: {
                                    borderRadius: '10px',
                                    background: '#333',
                                    color: '#fff',
                                }
                            });
                        }}
                        className="
                            p-2 rounded-full 
                            hover:bg-gray-100 dark:hover:bg-gray-800 
                            transition-all duration-300 
                            hover:scale-110
                        "
                    >
                        <FaClipboard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* <Link href={`/blogs/${post._id}`} className="w-full"> */}
                    <Link href={`/blogs/${post.slug}`} className="w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            className="
                                group 
                                w-full 
                                hover:bg-blue-500 hover:text-white 
                                dark:hover:bg-blue-600 
                                text-gray-800 dark:text-gray-200 
                                border-gray-300 dark:border-gray-600 
                                transition-all duration-300 
                                rounded-full
                            "
                        >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
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
const CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "DSA", label: "DSA" },
    { value: "Job Posting", label: "Job Posting" },
    { value: "WebDev", label: "Web Development" },
    { value: "AI", label: "Artificial Intelligence" },
    { value: "ML", label: "Machine Learning" },
    { value: "Skill Development", label: "Skill Development" },
    { value: "Resume and Cover Letter Guidance", label: "Resume & Cover Letter" },
    { value: "Interview Preparation", label: "Interview Prep" },
    { value: "Tech-news", label: "Tech News" },
    { value: "Internship", label: "Internship" },
    { value: "Others", label: "Others" }
];

export { BlogPostCard, SkeletonCard, CATEGORIES };