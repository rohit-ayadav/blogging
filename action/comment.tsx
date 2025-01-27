"use server";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { isValidSlug } from "@/lib/common-function";
import Comment from "@/models/comment.models";
import { getSessionAtHome } from "@/auth";

await connectDB();

interface ResponseType {
    comments: any[];
    error: string;
}

let response: ResponseType = {
    comments: [],
    error: ""
};
async function getComment(id: string) {
    let post;
    if (!id) {
        response.error = "No id provided";
        return response;
    }

    try {
        if (!isValidObjectId(id)) {
            if (!isValidSlug(id)) {
                response.error = "Invalid id";
                return response;
            }
        }
        if (isValidObjectId(id)) {
            post = await Blog.findById(id);
        } else {
            post = await Blog.findOne({ slug: id });
        }

        if (!post) {
            response.error = "Post not found";
            return response;
        }
        const comments = await Comment.find({ postId: id });
        response.comments = comments;
        return response;
    } catch (error) {
        console.error("Error getting comments:", error);
        response.error = `Error getting comments: ${error}`;
        return response;
    }
}

async function postComment({ body }: { body: { postId: string, name: string | null | undefined, email: string | null | undefined, content: string } }): Promise<ResponseType> {
    const session = await getSessionAtHome();
    response.error = "";
    response.comments = [];
    if (!session) {
        response.error = "Not authorized to post comment.";
        return response;
    }

    if (!body.postId || !body.name || !body.email || !body.content) {
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

        const newComment = new Comment({ postId: body.postId, name: body.name, email: body.email, content: body.content });
        await newComment.save();
        response.comments = [newComment];
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
        response.comments = [comment];
        return response;
    } catch (error) {
        console.error("Error deleting comment:", error);
        response.error = `Error deleting comment: ${error}`;
        return response;
    }
}

async function updateComment({ body }: { body: { id: string, name: string | null | undefined, email: string | null | undefined, content: string } }) {
    if (!body.id) {
        response.error = "No id provided";
        return response;
    }
    try {
        const comment = await Comment.findByIdAndUpdate(body.id, { name: body.name, email: body.email, content: body.content }, { new: true });
        if (!comment) {
            response.error = "Comment not found";
            return response;
        }
        response.comments = [comment];
        return response;
    }
    catch (error) {
        console.error("Error updating comment:", error);
        response.error = `Error updating comment: ${error}`;
        return response;
    }
}


export { getComment, postComment, deleteComment, updateComment };