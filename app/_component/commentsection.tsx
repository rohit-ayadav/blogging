import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { getComment, postComment, deleteComment, updateComment } from '@/action/comment';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Comment {
    _id: string;
    name: string;
    email: string;
    content: string;
    image: string;
    createdAt: string | number | Date;
}

interface CommentSectionProps {
    postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const { data: session } = useSession();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getComment(postId);
                if (response.error) {
                    throw new Error(response.error);
                }
                setComments(response.comments.map((comment: any) => ({
                    _id: comment._id.toString(),
                    name: comment.name,
                    email: comment.email,
                    content: comment.content,
                    image: comment.image,
                    createdAt: comment.createdAt,
                })));
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
            setSubmissionStatus('submitting');
            setError(null);
            if (!session.user) {
                setError('User information is missing. Please login again.');
                return;
            }
            if (content.length > 500) {
                setError('Comment cannot be more than 500 characters');
                return;
            }

            if (editingCommentId) {
                const response = await updateComment({
                    // commentId: editingCommentId,
                    body: {
                        id: editingCommentId,
                        name: session.user.name,
                        email: session.user.email,
                        content
                    }
                });
                if (response.error) {
                    throw new Error(response.error);
                }

                // setComments(comments.map(comment =>
                //     comment._id === editingCommentId
                //         ? { ...comment, content: response.comment.content }
                //         : comment
                // ));
                setEditingCommentId(null);
            } else {
                // Post new comment
                const response = await postComment({
                    body: {
                        postId,
                        name: session.user.name,
                        email: session.user.email,
                        content
                    }
                });
                if (response.error) {
                    throw new Error(response.error);
                }
                setComments([...comments, response.comments[response.comments.length - 1]]);
            }

            setContent('');
            setSubmissionStatus('success');
        } catch (error) {
            setError('Failed to post comment. Please try again later.');
            setSubmissionStatus('error');
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        try {
            const response = await deleteComment(commentId);
            if (response.error) {
                throw new Error(response.error);
            }
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            setError('Failed to delete comment. Please try again later.');
        }
    }

    const startEditingComment = (comment: Comment) => {
        setEditingCommentId(comment._id);
        setContent(comment.content);
    }

    const getThemeStyles = (baseLight: string, baseDark: string) =>
        isDarkMode ? baseDark : baseLight;

    const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
        const isCurrentUserComment = session?.user?.email === comment.email;

        return (
            <div
                className={`
                    rounded-lg shadow-sm mb-4 p-4 relative
                    ${getThemeStyles(
                    'bg-white',
                    'bg-gray-800'
                )}
                `}
            >
                {isCurrentUserComment && editingCommentId !== comment._id && (
                    <div className="absolute top-2 right-2 space-x-2">
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingComment(comment)}
                            className={`
                                mr-2
                                ${getThemeStyles(
                                'text-blue-600 hover:text-blue-700',
                                'text-blue-400 hover:text-blue-500'
                            )}
                            `}
                        >
                            Edit
                        </Button> */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            className={`
                                ${getThemeStyles(
                                'text-red-600 hover:text-red-700',
                                'text-red-400 hover:text-red-500'
                            )}
                            `}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                )}
                <div className="flex items-start space-x-4">
                    <Avatar
                        className={`
                            h-10 w-10 border-2
                            ${getThemeStyles(
                            'border-gray-200',
                            'border-gray-700'
                        )}
                        `}
                    >
                        <AvatarImage src={comment.image} alt={comment.name} />
                        <AvatarFallback
                            className={`
                                ${getThemeStyles(
                                'bg-gray-100 text-gray-600',
                                'bg-gray-700 text-gray-300'
                            )}
                            `}
                        >
                            {comment.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <h4
                                className={`
                                    font-semibold text-sm
                                    ${getThemeStyles(
                                    'text-gray-800',
                                    'text-gray-200'
                                )}
                                `}
                            >
                                {comment.name}
                            </h4>
                            <span
                                className={`
                                    text-xs
                                    ${getThemeStyles(
                                    'text-gray-500',
                                    'text-gray-400'
                                )}
                                `}
                            >
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p
                            className={`
                                text-sm
                                ${getThemeStyles(
                                'text-gray-700',
                                'text-gray-300'
                            )}
                            `}
                        >
                            {comment.content}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`
            max-w-2xl mx-auto px-4 py-8
            ${getThemeStyles(
            'bg-white text-gray-900',
            'bg-gray-900 text-gray-100'
        )}
        `}>
            <div className="mb-6">
                <h2
                    className={`
                        text-2xl font-bold mb-4
                        ${getThemeStyles(
                        'text-gray-900',
                        'text-gray-100'
                    )}
                    `}
                >
                    Comments
                </h2>

                {session ? (
                    <form onSubmit={handlePostComment} className="space-y-4">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`
                                min-h-[120px] resize-none
                                ${getThemeStyles(
                                'bg-white text-gray-900 border-gray-300',
                                'bg-gray-800 text-gray-100 border-gray-700'
                            )}
                                focus:ring-2 focus:ring-blue-500
                            `}
                        />
                        {error && (
                            <div
                                className={`
                                    text-sm mb-2
                                    ${getThemeStyles(
                                    'text-red-500',
                                    'text-red-400'
                                )}
                                `}
                            >
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            disabled={submissionStatus === 'submitting' || !content.trim()}
                            className={`
                                w-full transition-colors duration-300
                                ${getThemeStyles(
                                'bg-blue-600 hover:bg-blue-700',
                                'bg-blue-700 hover:bg-blue-800'
                            )}
                                text-white
                            `}
                        >
                            {editingCommentId
                                ? 'Update Comment'
                                : (submissionStatus === 'submitting'
                                    ? 'Posting...'
                                    : 'Post Comment')
                            }
                        </Button>
                        {editingCommentId && (
                            <Button
                                type="button"
                                onClick={() => {
                                    setEditingCommentId(null);
                                    setContent('');
                                }}
                                className={`
                                    w-full mt-2 transition-colors duration-300
                                    ${getThemeStyles(
                                    'bg-gray-200 hover:bg-gray-300 text-gray-700',
                                    'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                )}
                                `}
                            >
                                Cancel Edit
                            </Button>
                        )}
                        {submissionStatus === 'success' && (
                            <div
                                className={`
                                    text-sm mt-2
                                    ${getThemeStyles(
                                    'text-green-600',
                                    'text-green-400'
                                )}
                                `}
                            >
                                Comment {editingCommentId ? 'updated' : 'posted'} successfully!
                            </div>
                        )}
                    </form>
                ) : (
                    <div
                        className={`
                            rounded-lg p-6 text-center
                            ${getThemeStyles(
                            'bg-gray-50',
                            'bg-gray-800'
                        )}
                        `}
                    >
                        <p
                            className={`
                                mb-4
                                ${getThemeStyles(
                                'text-gray-600',
                                'text-gray-300'
                            )}
                            `}
                        >
                            Join the discussion by logging in
                        </p>
                        <Link href="/login">
                            <Button
                                className={`
                                transition-colors duration-300
                                ${getThemeStyles(
                                    'bg-blue-600 hover:bg-blue-700',
                                    'bg-blue-700 hover:bg-blue-800'
                                )}
                                text-white
                            `}
                            >
                                Login to Comment
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className={`
                                rounded-lg shadow-sm mb-4 p-4 animate-pulse
                                ${getThemeStyles(
                                'bg-white',
                                'bg-gray-800'
                            )}
                            `}
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`
                                        rounded-full h-10 w-10
                                        ${getThemeStyles(
                                        'bg-gray-300',
                                        'bg-gray-700'
                                    )}
                                    `}
                                ></div>
                                <div className="flex-1 space-y-2">
                                    <div
                                        className={`
                                            h-4 rounded w-3/4
                                            ${getThemeStyles(
                                            'bg-gray-300',
                                            'bg-gray-700'
                                        )}
                                        `}
                                    ></div>
                                    <div
                                        className={`
                                            h-4 rounded w-1/2
                                            ${getThemeStyles(
                                            'bg-gray-300',
                                            'bg-gray-700'
                                        )}
                                        `}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <div
                        className={`
                            text-center py-8
                            ${getThemeStyles(
                            'text-red-500',
                            'text-red-400'
                        )}
                        `}
                    >
                        {error}
                    </div>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))
                ) : (
                    <div
                        className={`
                            text-center py-8
                            ${getThemeStyles(
                            'text-gray-500',
                            'text-gray-400'
                        )}
                        `}
                    >
                        No comments yet. Be the first to comment!
                    </div>
                )}
            </div>
        </div>
    );
};