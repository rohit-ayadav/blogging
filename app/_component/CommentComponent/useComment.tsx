import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { deleteComment, getComment, postComment, updateComment } from '@/action/comment';

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

const useComment = (postId: string) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [likedComments, setLikedComments] = useState<string[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { data: session } = useSession();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getComment(postId);
            if (response.error) {
                throw new Error(response.error);
            }
            // Sort comments by newest first
            const sortedComments = response.comments.sort((a: Comment, b: Comment) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            // Add likes property if it doesn't exist
            const commentsWithLikes = sortedComments.map((comment: Comment) => ({
                ...comment,
                likes: comment.likes || 0,
                likedBy: comment.likedBy || []
            }));

            setComments(commentsWithLikes);
            setCommentCount(commentsWithLikes.length);

            // Set liked comments based on current user
            // if (session?.user?.email) {
            //     const userLikedComments = commentsWithLikes
            //         .filter(comment => comment.likedBy?.includes(session.user.email as string))
            //         .map(comment => comment._id);
            //     setLikedComments(userLikedComments);
            // }
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

    // Focus the textarea when starting edit mode
    useEffect(() => {
        if (editingCommentId && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingCommentId]);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
        // Clear notification after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            showNotification('Please login to comment', 'error');
            return;
        }

        if (!content.trim()) {
            showNotification('Comment cannot be empty', 'error');
            return;
        }

        if (content.length > 1000) {
            showNotification('Comment cannot be more than 1000 characters', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            if (!session.user || !session.user.email) {
                showNotification('User information is missing. Please login again.', 'error');
                return;
            }

            if (editingCommentId) {
                // if content is same as previous, do nothing
                if (comments.find(comment => comment._id === editingCommentId)?.content === content) {
                    setEditingCommentId(null);
                    setContent('');
                    return;
                }
                alert(`Editing comment: ${editingCommentId}`);
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

                showNotification('Your comment has been updated successfully.', 'success');
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
                    const newComment = {
                        ...response.comments[0],
                        likes: 0,
                        likedBy: []
                    };
                    setComments([newComment, ...comments]);
                    setCommentCount(prev => prev + 1);
                    showNotification('Your comment has been posted successfully.', 'success');
                }
            }

            setContent('');
        } catch (error) {
            if (error instanceof Error) {
                showNotification(`Failed to post comment. ${error.message}`, 'error');
            } else {
                showNotification('Failed to post comment. Please try again later.', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            setIsSubmitting(true);
            setError(null);
            const response = await deleteComment(commentId);
            if (response.error) throw new Error(response.error);

            setComments(comments.filter(comment => comment._id !== commentId));
            setCommentCount(prev => prev - 1);
            showNotification('Your comment has been deleted successfully.', 'success');
            setShowDeleteDialog(null);
        } catch (error) {
            if (error instanceof Error) {
                showNotification(`Failed to delete comment. ${error.message}`, 'error');
            } else {
                showNotification('Failed to delete comment. Please try again later.', 'error');
            }
        } finally {
            setIsSubmitting(false);
            showDeleteDialog && setShowDeleteDialog(null);
        }
    };

    const handleLikeComment = (commentId: string) => {
        // This is just UI state for now - backend will be added later
        if (likedComments.includes(commentId)) {
            // Unlike
            setLikedComments(likedComments.filter(id => id !== commentId));
            setComments(comments.map(comment =>
                comment._id === commentId
                    ? { ...comment, likes: (comment.likes || 0) - 1 }
                    : comment
            ));
        } else {
            // Like
            setLikedComments([...likedComments, commentId]);
            setComments(comments.map(comment =>
                comment._id === commentId
                    ? { ...comment, likes: (comment.likes || 0) + 1 }
                    : comment
            ));
        }
        // Toast notification for future backend implementation
        showNotification('Like functionality will be implemented on the backend later.', 'info');
    };

    const startEditingComment = (comment: Comment) => {
        setEditingCommentId(comment._id);
        setContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setContent('');
    };
    return {
        comments,
        commentCount,
        isLoading,
        isSubmitting,
        error,
        content,
        editingCommentId,
        likedComments,
        showDeleteDialog,
        notification,
        setNotification,
        fetchComments,
        setContent,
        textareaRef,
        handlePostComment,
        handleDeleteComment,
        handleLikeComment,
        startEditingComment,
        cancelEdit,
        setShowDeleteDialog
    };
}

export default useComment;