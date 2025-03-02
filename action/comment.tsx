"use server";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { isValidSlug } from "@/lib/common-function";
import Comment from "@/models/comment.models";
import { getSessionAtHome } from "@/auth";
import User from "@/models/users.models";
import serializeDocument from "@/utils/date-formatter";
import { revalidatePath } from "next/cache";

await connectDB();
interface ResponseType {
    comments: {
        _id: string;
        postId: string;
        createdBy: {
            name: string;
            email: string;
            image: string;
        }
        content: string;
        createdAt: Date;
    }[]
    error: string;
}

let response: ResponseType = {
    comments: [],
    error: ""
};

interface ResponseType {
    comments: {
        _id: string;
        postId: string;
        createdBy: {
            name: string;
            email: string;
            image: string;
        };
        content: string;
        createdAt: Date;
    }[];
    error: string;
}

async function getComment(id: string): Promise<ResponseType> {
    let response: ResponseType = { comments: [], error: "" };
    try {
        if (!id) {
            return { ...response, error: "No id provided" };
        }

        let post;
        if (isValidObjectId(id)) {
            post = await Blog.findById(id);
        } else if (isValidSlug(id)) {
            post = await Blog.findOne({ slug: id });
        } else {
            return { ...response, error: "Invalid id or slug" };
        }

        if (!post) {
            return { ...response, error: "Post not found" };
        }

        // Find comments where postId matches either `_id` or `slug`
        const postId = post._id.toString();
        const postSlug = post.slug;
        const comments = await Comment.find({
            postId: { $in: [postId, postSlug] }
        });

        // Extract unique emails from comments
        const uniqueEmails = [...new Set(comments.map(comment => comment.createdBy))];

        // Fetch users based on extracted emails
        const users = await User.find({ email: { $in: uniqueEmails } });

        // Create a map for quick email-to-user lookup
        const userMap = new Map(users.map(user => [user.email, user]));

        // Format comments with user details
        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            postId: comment.postId,
            createdBy: {
                email: comment.createdBy,
                name: userMap.get(comment.createdBy)?.name || "Unknown",
                image: userMap.get(comment.createdBy)?.image || ""
            },
            content: comment.content,
            createdAt: comment.createdAt
        }));
        const serializeResponse = formattedComments.map(comment => serializeDocument(comment));
        return { comments: serializeResponse, error: "" };
    } catch (error: any) {
        console.error("Error getting comments:", error);
        return { comments: [], error: `Error getting comments: ${error.message}` };
    }
}

async function postComment({ body }: { body: { postId: string, email: string, content: string } }) {
    const session = await getSessionAtHome();
    response.error = "";
    response.comments = [];
    if (!session) {
        response.error = "Not authorized to post comment.";
        return response;
    }

    if (!body.postId || !body.email || !body.content) {
        response.error = "All fields are required.";
        return response;
    }
    if (!isValidObjectId(body.postId)) {
        if (!isValidSlug(body.postId)) {
            response.error = "Invalid postId.";
            return response;
        }
    }
    let post;
    if (isValidObjectId(body.postId)) {
        post = await Blog.findById(body.postId);
    }
    else {
        post = await Blog.findOne({ slug: body.postId });
    }
    if (!post) {
        response.error = "Post not found.";
        return response;
    }

    try {
        const newComment: typeof Comment.prototype = new Comment({ postId: body.postId, createdBy: body.email, content: body.content });
        await newComment.save();
        response.comments = [
            {
                _id: newComment._id,
                postId: newComment.postId,
                createdBy: {
                    email: newComment.createdBy,
                    name: session.user.name,
                    image: session.user.image
                },
                content: newComment.content,
                createdAt: newComment.createdAt
            }
        ]
        revalidatePath(`/blogs/${post.slug}`);
        revalidatePath(`/blogs/${post._id}`);
        revalidatePath(`/`);
        revalidatePath(`/blogs`);
        response.error = '';
        const serializeResponse = serializeDocument(response);
        response = serializeResponse;
        return response;
    } catch (error) {
        console.error("Error saving comment:", error);
        response.error = "Error saving comment.";
        return response;
    }
}

async function deleteComment(id: string) {
    if (!id) {
        response.error = "No id provided";
        return response;
    }
    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            response.error = "Comment not found";
            return response;
        }

        let post;
        if (isValidObjectId(comment.postId)) {
            post = await Blog.findById(comment.postId);
        } else if (isValidSlug(comment.postId)) {
            post = await Blog.findOne({ slug: comment.postId });
        }

        if (post) {
            revalidatePath(`/blogs/${post.slug}`);
            revalidatePath(`/blogs/${post._id}`);
        }
        revalidatePath(`/`);
        revalidatePath(`/blogs`);
        response.comments = [comment];
        const serializeResponse = serializeDocument(response);
        return response = serializeResponse;
    } catch (error) {
        console.error("Error deleting comment:", error);
        response.error = `Error deleting comment: ${error}`;
        return response;
    }
}

async function updateComment({ body }: { body: { id: string, email: string, content: string } }) {
    if (!body.id) {
        response.error = "No id provided";
        return response;
    }
    if (!isValidObjectId(body.id)) {
        response.error = "Invalid id";
        return response;
    }
    try {
        const comment = await Comment.findByIdAndUpdate(body.id, { createdBy: body.email, content: body.content }, { new: true });
        if (!comment) {
            response.error = "Comment not found";
            return response;
        }
        // Find the post to revalidate
        let post;
        if (isValidObjectId(comment.postId)) {
            post = await Blog.findById(comment.postId);
        }
        else {
            post = await Blog.findOne({ slug: comment.postId });
        }
        if (post) {
            revalidatePath(`/blogs/${post.slug}`);
            revalidatePath(`/blogs/${post._id}`);
        }
        revalidatePath(`/`);
        revalidatePath(`/blogs`);
        response.comments = [comment];
        const serializeResponse = serializeDocument(response);
        return response = serializeResponse;
    }
    catch (error) {
        console.error("Error updating comment:", error);
        response.error = `Error updating comment: ${error}`;
        return response;
    }
}


export { getComment, postComment, deleteComment, updateComment };