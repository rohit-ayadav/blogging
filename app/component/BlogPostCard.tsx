import Link from 'next/link';
import { FaClipboard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Eye, ImageIcon, ThumbsUp, User } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from '@/components/ui/card';

interface BlogPostType {
    _id: string;
    title: string;
    createdAt: string;
    tags?: string[];
    content: string;
    createdBy: string;
    thumbnail?: string;
    views?: number;
    likes?: number;
    bio?: string;
    category: string;
}

interface UserType {
    email: string;
    name: string;
    image: string;
    bio: string;
    follower: number;
    following: number;
    noOfBlogs: number;
    createdAt: string;
    updatedAt: string;
    theme: string;
}

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
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} text-sm font-medium transition-transform duration-300 hover:scale-105`}>
                        {post.category}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <CardTitle className="text-white text-xl sm:text-2xl font-bold line-clamp-2 mb-2">
                        {post.title}
                    </CardTitle>
                    <div className="flex items-center justify-between text-gray-200">
                        <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-medium">{post.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span className="text-sm font-medium">{post.likes || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CardContent className="flex-grow pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.slice(0, 3).map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2.5 py-0.5 rounded-full transition-transform duration-300 hover:scale-105"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
                    {post.content.replace(/<[^>]+>/g, '')}
                </p>
            </CardContent>
            <div className="mt-auto">
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <Avatar className="ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-700">
                            {user?.image ? (
                                // <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                <img src={user.image} alt={user.name} />
                            ) : (
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user?.name || 'Unknown User'}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${post.title}\nRead here: ${window.location.origin}/blogs/${post._id}\n\n`);
                            toast.success('Copied to clipboard!');
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-transform duration-300 hover:scale-105"
                    >
                        <FaClipboard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </CardFooter>
                <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <Link href={`/blogs/${post._id}`} className="w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full group hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 transition-all duration-300"
                        >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </CardFooter>
            </div>
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