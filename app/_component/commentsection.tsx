"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { getComment, postComment, deleteComment, updateComment } from '@/action/comment';
import { Trash2, Edit2, Heart, MessageCircle, Clock, Send, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/utils/date-formatter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface Comment {
    _id: string;
    postId: string;
    createdBy: {
        name: string;
        email: string;
        image: string;
    }
    content: string;
    createdAt: Date;
}
interface CommentSectionProps {
    postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [commentCount, setCommentCount] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { data: session } = useSession();
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getComment(postId);
                if (response.error) {
                    throw new Error(response.error);
                }
                // Sort comments by newest first
                const sortedComments = response.comments.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setComments(sortedComments);
                setCommentCount(sortedComments.length);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Failed to fetch comments. ${error.message}`);
                } else {
                    setError('Failed to fetch comments.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    // Focus the textarea when starting edit mode
    useEffect(() => {
        if (editingCommentId && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingCommentId]);

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            setError('Please login to comment');
            return;
        }

        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmissionStatus('submitting');
            setError(null);

            if (!session.user || !session.user.email) {
                setError('User information is missing. Please login again.');
                return;
            }

            if (content.length > 1000) {
                setError('Comment cannot be more than 1000 characters');
                return;
            }

            if (editingCommentId) {
                const response = await updateComment({
                    body: {
                        id: editingCommentId,
                        email: session.user.email,
                        content: content
                    }
                });

                if (response.error) {
                    throw new Error(response.error);
                }

                setComments(comments.map(comment =>
                    comment._id === editingCommentId
                        ? { ...comment, content: content }
                        : comment
                ));
                toast({
                    title: 'Comment updated',
                    description: 'Your comment has been updated successfully.',
                    variant: 'default',
                });
                setEditingCommentId(null);
            } else {
                // Post new comment
                const response = await postComment({
                    body: {
                        postId,
                        email: session.user.email,
                        content: content
                    }
                });

                if (response.error) {
                    throw new Error(response.error);
                }

                // Add the new comment to the top of the list
                if (response.comments && response.comments.length > 0) {
                    setComments([response.comments[0], ...comments]);
                    setCommentCount(prev => prev + 1);
                }
            }

            setContent('');
            setSubmissionStatus('success');

            // Reset success status after 3 seconds
            setTimeout(() => {
                setSubmissionStatus('idle');
            }, 3000);

        } catch (error) {
            if (error instanceof Error) {
                setError(`Failed to post comment. ${error.message}`);
            } else {
                setError('Failed to post comment. Please try again later.');
            }
            toast({
                title: 'Error',
                description: 'Failed to post comment. Please try again later.',
                variant: 'destructive',
            })
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        // set error for 5000ms only
        setTimeout(() => {
            setError(null);
        }, 5000);
    }, [error]);

    const handleDeleteComment = async (commentId: string) => {
        // alert(`Deleting comment with ID: ${commentId}`);
        try {
            setIsSubmitting(true);
            setError(null);
            const response = await deleteComment(commentId);
            if (response.error) throw new Error(response.error);

            setComments(comments.filter(comment => comment._id !== commentId));
            setCommentCount(prev => prev - 1);
            toast({
                title: 'Comment deleted',
                description: 'Your comment has been deleted successfully.',
                variant: 'default',
            })
            setShowDeleteDialog(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(`Failed to delete comment. ${error.message}`);
            } else {
                setError('Failed to delete comment. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditingComment = (comment: Comment) => {
        setEditingCommentId(comment._id);
        setContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setContent('');
    };

    const getThemeClass = (lightClass: string, darkClass: string) =>
        isDarkMode ? darkClass : lightClass;

    const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
        const isCurrentUserComment = session?.user?.email === comment.createdBy.email;
        const isEditing = editingCommentId === comment._id;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <Card className={`mb-4 ${getThemeClass('bg-white', 'bg-gray-800')} border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
                    <CardContent className="pt-4">
                        <div className="flex items-start space-x-4">
                            <Avatar className={`h-10 w-10 border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
                                <AvatarImage src={comment.createdBy.image} alt={comment.createdBy.name} />
                                <AvatarFallback className={getThemeClass('bg-gray-100 text-gray-600', 'bg-gray-700 text-gray-300')}>
                                    {comment.createdBy.name ? comment.createdBy.name[0].toUpperCase() : '?'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex flex-wrap justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <h4 className={`font-semibold ${getThemeClass('text-gray-800', 'text-gray-200')}`}>
                                            {comment.createdBy.name}
                                        </h4>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center ml-2">
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
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEditingComment(comment)}
                                                className={`px-2 py-1 rounded ${getThemeClass('text-blue-600 hover:bg-blue-50', 'text-blue-400 hover:bg-gray-700')}`}
                                            >
                                                <Edit2 size={16} />
                                                <span className="ml-1 hidden sm:inline">Edit</span>
                                            </Button>

                                            {/* <AlertDialogTrigger asChild> */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowDeleteDialog(comment._id)}
                                                className={`px-2 py-1 rounded ${getThemeClass('text-red-600 hover:bg-red-50', 'text-red-400 hover:bg-gray-700')}`}
                                            >
                                                <Trash2 size={16} />
                                                <span className="ml-1 hidden sm:inline">Delete</span>
                                            </Button>
                                            {/* </AlertDialogTrigger> */}
                                        </div>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="mt-2 space-y-2">
                                        <Textarea
                                            ref={textareaRef}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className={`min-h-[100px] p-2 w-full border rounded ${getThemeClass(
                                                'bg-white text-gray-900 border-gray-300',
                                                'bg-gray-700 text-gray-100 border-gray-600'
                                            )}`}
                                        />
                                        <div className="flex space-x-2 mt-2">
                                            <Button
                                                onClick={handlePostComment}
                                                disabled={isSubmitting || !content.trim()}
                                                className={`${getThemeClass(
                                                    'bg-blue-600 hover:bg-blue-700',
                                                    'bg-blue-700 hover:bg-blue-800'
                                                )} text-white px-4 py-2 rounded`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : 'Update'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                className={`${getThemeClass(
                                                    'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
                                                    'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                                                )} px-4 py-2 rounded`}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`text-sm whitespace-pre-wrap ${getThemeClass('text-gray-700', 'text-gray-300')}`}>
                                        {comment.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    // Skeleton loading component
    const CommentSkeleton = () => (
        <Card className={`mb-4 ${getThemeClass('bg-white', 'bg-gray-800')} border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
            <CardContent className="pt-4">
                <div className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4 rounded" />
                            <Skeleton className="h-4 w-1/6 rounded" />
                        </div>
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className={`max-w-3xl mx-auto ${getThemeClass('bg-gray-50', 'bg-gray-900')} rounded-lg shadow-sm overflow-hidden`}>
            <div className="px-4 sm:px-6 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <h2 className={`text-2xl font-bold ${getThemeClass('text-gray-900', 'text-gray-100')}`}>
                            Comments
                        </h2>
                        <Badge variant="outline" className={getThemeClass('bg-blue-50 text-blue-600', 'bg-blue-900/30 text-blue-400')}>
                            {commentCount}
                        </Badge>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleDarkMode}
                        className={getThemeClass(
                            'text-gray-600 border-gray-300',
                            'text-gray-300 border-gray-700'
                        )}
                    >
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </div>

                {session ? (
                    <Card className={`mb-8 border ${getThemeClass('bg-white border-gray-200', 'bg-gray-800 border-gray-700')}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className={`text-lg ${getThemeClass('text-gray-800', 'text-gray-200')}`}>
                                Add a comment
                            </CardTitle>
                            <CardDescription className={getThemeClass('text-gray-500', 'text-gray-400')}>
                                Share your thoughts on this post
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePostComment} className="space-y-4">
                                <div className="relative">
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Write your comment here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className={`min-h-[120px] resize-none p-4 ${getThemeClass(
                                            'bg-white text-gray-900 border-gray-300',
                                            'bg-gray-800 text-gray-100 border-gray-700'
                                        )}`}
                                    />
                                    <div className={`absolute bottom-2 right-2 text-xs ${getThemeClass(
                                        'text-gray-500',
                                        'text-gray-400'
                                    )}`}>
                                        {content.length}/1000
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                {submissionStatus === 'success' && (
                                    <div className="flex items-center gap-2 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        Comment {editingCommentId ? 'updated' : 'posted'} successfully!
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim()}
                                    className={`w-full ${getThemeClass(
                                        'bg-blue-600 hover:bg-blue-700',
                                        'bg-blue-700 hover:bg-blue-800'
                                    )} text-white flex items-center justify-center`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            {editingCommentId ? 'Updating...' : 'Posting...'}
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} className="mr-2" />
                                            {editingCommentId ? 'Update Comment' : 'Post Comment'}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className={`mb-8 border ${getThemeClass('bg-white border-gray-200', 'bg-gray-800 border-gray-700')}`}>
                        <CardContent className="pt-6 flex flex-col items-center p-8">
                            <MessageCircle size={40} className={`mb-4 ${getThemeClass('text-blue-500', 'text-blue-400')}`} />
                            <h3 className={`text-xl font-semibold mb-2 ${getThemeClass('text-gray-800', 'text-gray-200')}`}>
                                Join the conversation
                            </h3>
                            <p className={`text-center mb-6 ${getThemeClass('text-gray-600', 'text-gray-400')}`}>
                                Sign in to share your thoughts and connect with other readers
                            </p>
                            <Link href="/login" className="inline-block">
                                <Button className={`${getThemeClass(
                                    'bg-blue-600 hover:bg-blue-700',
                                    'bg-blue-700 hover:bg-blue-800'
                                )} text-white px-8`}>
                                    Sign in to Comment
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-2">
                    {isLoading ? (
                        // Show skeleton loading placeholders
                        Array.from({ length: 3 }).map((_, i) => (
                            <CommentSkeleton key={i} />
                        ))
                    ) : error && !comments.length ? (
                        <div className={`text-center py-12 ${getThemeClass('text-gray-600', 'text-gray-400')}`}>
                            <AlertCircle size={40} className="mx-auto mb-4 text-red-500" />
                            <p className="text-lg font-medium mb-2">Oops! Something went wrong</p>
                            <p>{error}</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : comments.length > 0 ? (
                        <AnimatePresence>
                            {comments.map(comment => (
                                <CommentItem key={comment._id} comment={comment} />
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className={`text-center py-16 ${getThemeClass('text-gray-600', 'text-gray-400')}`}>
                            <MessageCircle size={40} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No comments yet</p>
                            <p className="mt-1">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Comment Confirmation Dialog */}
            <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
                <AlertDialogContent className={getThemeClass('bg-white', 'bg-gray-800 text-white')}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription className={getThemeClass('text-gray-600', 'text-gray-300')}>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={getThemeClass('text-gray-700', 'bg-gray-700 text-gray-200 hover:bg-gray-600')}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => showDeleteDialog && handleDeleteComment(showDeleteDialog)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};