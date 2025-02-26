import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Clock, Edit2, ThumbsUp, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatRelativeTime } from "@/utils/date-formatter";
import { useThemeClass } from "./DeleteConfirmation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
    name: string;
    email: string;
    image: string;
}

interface Comment {
    _id: string;
    postId: string;
    createdBy: User;
    content: string;
    createdAt: Date;
    likes?: number;
    likedBy?: string[];
}
// Individual comment component

export const CommentItem = ({
    comment,
    currentUserEmail,
    onEdit,
    onDelete,
    onLike,
    isEditing,
    liked
}: {
    comment: Comment,
    currentUserEmail: string | null | undefined,
    onEdit: (comment: Comment) => void,
    onDelete: (commentId: string) => void,
    onLike: (commentId: string) => void,
    isEditing: boolean,
    liked: boolean
}) => {
    const getThemeClass = useThemeClass();
    const isCurrentUserComment = currentUserEmail === comment.createdBy.email;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`mb-4 ${getThemeClass('bg-white', 'bg-gray-800')} border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
                <CardContent className="pt-4">
                    <div className="flex items-start space-x-4">
                        <Avatar className={`h-10 w-10 border ${getThemeClass('border-gray-200', 'border-gray-700')} shrink-0`}>
                            <AvatarImage src={comment.createdBy.image} alt={comment.createdBy.name} />
                            <AvatarFallback className={getThemeClass('bg-gray-100 text-gray-600', 'bg-gray-700 text-gray-300')}>
                                {comment.createdBy.name ? comment.createdBy.name[0].toUpperCase() : '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                                <div className="flex items-center flex-wrap gap-2">
                                    <h4 className={`font-semibold ${getThemeClass('text-gray-800', 'text-gray-200')} break-all`}>
                                        {comment.createdBy.name}
                                    </h4>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center">
                                                    <Clock size={14} className={getThemeClass('text-gray-400', 'text-gray-500')} />
                                                    <span className={`text-xs ml-1 ${getThemeClass('text-gray-500', 'text-gray-400')}`}>
                                                        {formatRelativeTime(new Date(comment.createdAt))}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{new Date(comment.createdAt).toLocaleString()}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {isCurrentUserComment && !isEditing && (
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(comment)}
                                            className={`px-2 py-1 h-8 rounded ${getThemeClass('text-blue-600 hover:bg-blue-50', 'text-blue-400 hover:bg-gray-700')}`}
                                        >
                                            <Edit2 size={16} />
                                            <span className="ml-1 hidden sm:inline">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(comment._id)}
                                            className={`px-2 py-1 h-8 rounded ${getThemeClass('text-red-600 hover:bg-red-50', 'text-red-400 hover:bg-gray-700')}`}
                                        >
                                            <Trash2 size={16} />
                                            <span className="ml-1 hidden sm:inline">Delete</span>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <p className={`text-sm whitespace-pre-wrap break-words ${getThemeClass('text-gray-700', 'text-gray-300')} mb-3`}>
                                {comment.content}
                            </p>

                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onLike(comment._id)}
                                    className={`px-2 py-1 h-8 rounded-full flex items-center ${liked
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : getThemeClass('text-gray-600 hover:text-blue-600', 'text-gray-400 hover:text-blue-400')
                                        }`}
                                >
                                    <ThumbsUp size={16} className={liked ? 'fill-current' : ''} />
                                    <span className="ml-1.5 text-sm">{comment.likes || 0}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
