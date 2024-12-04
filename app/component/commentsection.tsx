import React, { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';
import { Trash2, Heart, Reply, MoreVertical, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentSectionProps {
    postId: string;
}

interface Comment {
    _id: string;
    name: string;
    email: string;
    content: string;
    image: string;
    createdAt: string | number | Date;
    likes: number;
    isEdited?: boolean;
    parentId?: string;
    replies?: Comment[];
}

const CommentComponent: React.FC<{
    comment: Comment;
    onDelete: (id: string) => void;
    onReply: (parentId: string) => void;
    onEdit: (id: string, content: string) => void;
    session: any;
    depth?: number;
}> = ({ comment, onDelete, onReply, onEdit, session, depth = 0 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const maxDepth = 3;

    const handleEdit = () => {
        onEdit(comment._id, editContent);
        setIsEditing(false);
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <Card className={`w-full ${depth > 0 ? 'ml-4 md:ml-8' : ''}`}>
            <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.image} alt={comment.name} />
                            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="text-sm font-semibold">{comment.name}</h4>
                            <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                        </div>
                    </div>

                    {session && comment.email === session.user?.email && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(comment._id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex space-x-2">
                            <Button size="sm" onClick={handleEdit}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700">{comment.content}</p>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <div className="flex space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`${isLiked ? 'text-red-500' : ''} p-0`}
                        onClick={toggleLike}
                    >
                        <Heart className="h-4 w-4 mr-1" fill={isLiked ? "currentColor" : "none"} />
                        <span className="text-xs">{comment.likes || 0}</span>
                    </Button>

                    {depth < maxDepth && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0"
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            <Reply className="h-4 w-4 mr-1" />
                            <span className="text-xs">Reply</span>
                        </Button>
                    )}
                </div>
            </CardFooter>

            {showReplyForm && (
                <div className="p-4 pt-0">
                    <Textarea
                        placeholder="Write a reply..."
                        className="min-h-[100px] mb-2"
                    />
                    <div className="flex space-x-2">
                        <Button size="sm" onClick={() => {
                            onReply(comment._id);
                            setShowReplyForm(false);
                        }}>Reply</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowReplyForm(false)}>Cancel</Button>
                    </div>
                </div>
            )}

            {comment.replies?.map(reply => (
                <CommentComponent
                    key={reply._id}
                    comment={reply}
                    onDelete={onDelete}
                    onReply={onReply}
                    onEdit={onEdit}
                    session={session}
                    depth={depth + 1}
                />
            ))}
        </Card>
    );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/comment?postId=${postId}`);
            const data = await response.json();
            const updatedComments = data.map((comment: Comment) => ({
                ...comment,
                image: comment.image || '/default-profile.jpg',
                likes: comment.likes || 0,
            }));
            setComments(updatedComments);
        } catch (error) {
            toast.error('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error('Please login to comment');
            return;
        }

        toast.promise(postComment(), {
            loading: 'Posting comment...',
            success: 'Comment posted successfully',
            error: (err) => `Error: ${err.message}`
        });
    };

    const postComment = async () => {
        if (!content.trim()) {
            throw new Error('Please enter a comment');
        }

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    content: content.trim(),
                    name: session?.user?.name,
                    email: session?.user?.email,
                    image: session?.user?.image || '/default-profile.jpg',
                }),
            });

            const data = await response.json();
            setComments([{ ...data, likes: 0 }, ...comments]);
            setContent('');
        } catch (error) {
            throw new Error('Failed to post comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        toast.promise(deleteComment(commentId), {
            loading: 'Deleting comment...',
            success: 'Comment deleted successfully',
            error: 'Failed to delete comment'
        });
    };

    const deleteComment = async (commentId: string) => {
        try {
            await fetch(`/api/comment?id=${commentId}`, {
                method: 'DELETE',
            });
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            throw new Error('Failed to delete comment');
        }
    };

    const handleEditComment = async (commentId: string, newContent: string) => {
        try {
            const response = await fetch(`/api/comment?id=${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent }),
            });

            if (response.ok) {
                setComments(comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, content: newContent, isEdited: true }
                        : comment
                ));
                toast.success('Comment updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update comment');
        }
    };

    const handleReply = async (parentId: string) => {
        toast.success('Reply feature coming soon');
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-xl">Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    {session ? (
                        <form onSubmit={handlePostComment} className="space-y-4">
                            <Textarea
                                placeholder="Share your thoughts..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                            <Button
                                type="submit"
                                className="w-full md:w-auto"
                                disabled={!content.trim()}
                            >
                                Post Comment
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <p className="mb-4 text-gray-600">Join the discussion by logging in</p>
                            <Button onClick={() => router.push('/login')}>Login to Comment</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4 mb-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="w-full">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentComponent
                            key={comment._id}
                            comment={comment}
                            onDelete={handleDeleteComment}
                            onReply={handleReply}
                            onEdit={handleEditComment}
                            session={session}
                        />
                    ))
                ) : (
                    <Card className="w-full">
                        <CardContent className="p-8 text-center text-gray-500">
                            No comments yet. Be the first to share your thoughts!
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CommentSection;