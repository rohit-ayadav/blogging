"use client";
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
// import { format } from 'date-fns';

import exp from 'constants';

interface CommentSectionProps {
    postId: string;
}

interface Comment {
    createdAt: string | number | Date;
    email: string;
    _id: string;
    name: string;
    content: string;
    image: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState<string>('');

    const { data: session } = useSession();

    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch(`/api/comment?postId=${postId}`);
            const data = await response.json();
            const updatedComments = data.map((comment: Comment) => ({
                ...comment,
                image: comment.image || '/default-profile.jpg',
            }));
            setComments(updatedComments);
        };

        fetchComments();
    }, [postId]);

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error('Please login to comment.');
            return;
        }
        toast.promise(postComment(), {
            loading: 'Posting comment...',
            success: 'Comment posted successfully.',
            error: 'Error posting comment.',
        });
    }

    const postComment = async () => {
        if (!session || !content) {
            throw new Error('Please login and enter a comment.');
        }

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    name: session.user?.name,
                    email: session.user?.email,
                    content,
                    image: session.user?.image || '/default-profile.jpg',
                }),
            });
            const data = await response.json();
            setComments([{ ...data, image: data.image || '/default-profile.jpg' }, ...comments]);
            setContent('');
        } catch (error) {
            throw new Error('Error saving comment.');
        }
    };

    const deleteComment = async (_id: string) => {
        toast.promise(deleteCommentById(_id), {
            loading: 'Deleting comment...',
            success: 'Comment deleted successfully.',
            error: 'Error deleting comment.',
        });
    }

    const deleteCommentById = async (_id: string) => {
        try {
            const response = await fetch(`/api/comment?id=${_id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setComments(comments.filter((comment) => comment._id !== _id));
            }
        } catch (error) {
            throw new Error('Error deleting comment.');
        }
    };

    return (
        <div>
            <Card className="mb-8 mt-6">
                <CardHeader>
                    <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        {session ? (
                            <form onSubmit={handlePostComment} className="space-y-4">
                                <Textarea
                                    placeholder="Write a comment..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full"
                                    rows={4}
                                />
                                <Button type="submit" className="w-full md:w-auto">Post Comment</Button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <p className="mb-4">Please log in to leave a comment.</p>
                                <Button onClick={() => window.open('/login')}>Login</Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <Card key={comment._id} className="w-full">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={comment.image} alt={comment.name} />
                                            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold">{comment.name}</h4>
                                            <p className="text-sm text-gray-500">{comment.email}</p>
                                            <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{comment.content}</p>
                                </CardContent>
                                {session && comment.email === session.user?.email && (
                                    <CardFooter>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteComment(comment._id)}
                                            className="ml-auto"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CommentSection;
