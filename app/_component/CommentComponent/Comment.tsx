"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence } from 'framer-motion';
import { SignInBanner } from './SignInBanner';
import { DeleteConfirmation, useThemeClass } from './DeleteConfirmation';
import { CommentItem } from './CommentItem';
import { CommentSkeleton, EmptyComments, ErrorState, ToastNotification } from './Others';
import { CommentEditor } from './CommentEditor';
import useComment from './useComment';
import { RefreshCcw } from 'lucide-react';

interface CommentSectionProps {
    postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { data: session } = useSession();
    const getThemeClass = useThemeClass();
    const { comments, commentCount, isLoading, isSubmitting, error, content, editingCommentId, likedComments, showDeleteDialog, notification, setNotification, fetchComments, setContent, textareaRef, handlePostComment, handleDeleteComment, handleLikeComment, startEditingComment, cancelEdit, setShowDeleteDialog } = useComment(postId);

    return (
        <div className={`max-w-3xl mx-auto ${getThemeClass('bg-gray-50', 'bg-gray-900')} rounded-lg shadow-sm overflow-hidden`}>
            <div className="px-4 sm:px-6 py-6">
                {/* Header section */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className={`text-xl sm:text-2xl font-bold ${getThemeClass('text-gray-900', 'text-gray-100')}`}>
                            Comments
                        </h2>
                        <Badge variant="outline" className={getThemeClass('bg-blue-50 text-blue-600', 'bg-blue-900/30 text-blue-400')}>
                            {commentCount}
                        </Badge>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => fetchComments()}
                        className={getThemeClass('text-gray-700 hover:bg-gray-100', 'bg-gray-700 text-gray-200 hover:bg-gray-600')}
                    >
                        <RefreshCcw size={16} className="mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Notification area */}
                <AnimatePresence>
                    {notification && (
                        <ToastNotification
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification(null)}
                        />
                    )}
                </AnimatePresence>

                {/* Comment form or sign-in prompt */}
                {session ? (
                    <Card className={`mb-8 border ${getThemeClass('bg-white border-gray-200', 'bg-gray-800 border-gray-700')}`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className={`h-8 w-8 border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
                                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                    <AvatarFallback className={getThemeClass('bg-gray-100 text-gray-600', 'bg-gray-700 text-gray-300')}>
                                        {session.user?.name ? session.user.name[0].toUpperCase() : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className={`font-medium ${getThemeClass('text-gray-700', 'text-gray-300')}`}>
                                    {session.user?.name || 'You'}
                                </span>
                            </div>

                            <CommentEditor
                                content={content}
                                setContent={setContent}
                                onSubmit={handlePostComment}
                                onCancel={editingCommentId ? cancelEdit : undefined}
                                isSubmitting={isSubmitting}
                                isEditing={!!editingCommentId}
                                textareaRef={textareaRef}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <SignInBanner />
                )}

                {/* Comments list */}
                <div className="space-y-2">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <CommentSkeleton key={i} />
                        ))
                    ) : error && !comments.length ? (
                        <ErrorState
                            error={error}
                            onRetry={() => fetchComments()}
                        />
                    ) : comments.length > 0 ? (
                        <AnimatePresence>
                            {comments.map(comment => (
                                <React.Fragment key={comment._id}>
                                    {editingCommentId === comment._id ? (
                                        <Card className={`mb-4 ${getThemeClass('bg-white', 'bg-gray-800')} border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
                                            <CardContent className="pt-4">
                                                <div className="flex items-start space-x-4">
                                                    <Avatar className={`h-10 w-10 border ${getThemeClass('border-gray-200', 'border-gray-700')} shrink-0`}>
                                                        <AvatarImage src={comment.createdBy.image} alt={comment.createdBy.name} />
                                                        <AvatarFallback className={getThemeClass('bg-gray-100 text-gray-600', 'bg-gray-700 text-gray-300')}>
                                                            {comment.createdBy.name ? comment.createdBy.name[0].toUpperCase() : '?'}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1">
                                                        <h4 className={`font-semibold ${getThemeClass('text-gray-800', 'text-gray-200')} mb-3`}>
                                                            {comment.createdBy.name} <span className={`font-normal ${getThemeClass('text-gray-500', 'text-gray-400')}`}>(Editing)</span>
                                                        </h4>
                                                        <CommentEditor
                                                            content={content}
                                                            setContent={setContent}
                                                            onSubmit={handlePostComment}
                                                            onCancel={cancelEdit}
                                                            isSubmitting={isSubmitting}
                                                            isEditing={true}
                                                            textareaRef={textareaRef}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <CommentItem
                                            comment={comment}
                                            currentUserEmail={session?.user?.email}
                                            onEdit={startEditingComment}
                                            onDelete={setShowDeleteDialog}
                                            onLike={handleLikeComment}
                                            isEditing={editingCommentId === comment._id}
                                            liked={likedComments.includes(comment._id)}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <EmptyComments />
                    )}
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <DeleteConfirmation
                isOpen={!!showDeleteDialog}
                onClose={() => setShowDeleteDialog(null)}
                onConfirm={() => showDeleteDialog && handleDeleteComment(showDeleteDialog)}
                isDeleting={isSubmitting}
            />
        </div>
    );
}

export default CommentSection;